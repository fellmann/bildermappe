import deepEqual from "fast-deep-equal"
import produce, { Draft } from "immer"
import { klona } from "klona"
import { Vector3 } from "three"
import { clamp } from "three/src/math/MathUtils"
import create, { GetState, SetState } from "zustand"
import { StoreApiWithSubscribeWithSelector, subscribeWithSelector } from "zustand/middleware"
import useSettingsStore from "./useSettingsStore"

export type ImagePositions = [number, number][]
export interface Image {
  name?: string
  positions: ImagePositions
  disabled?: boolean
}

export interface Choreography {
  images: Image[]
  floor: { width: number; height: number }
  persons: number
  name: string
  lastModified: number
  created: number
}

function newChoreo(): Choreography {
  return {
    name: "Neue Bildermappe",
    lastModified: Date.now(),
    images: [{ positions: [] }],
    floor: { width: 9, height: 9 },
    persons: 8,
    created: Date.now(),
  }
}

function load(): Choreography | undefined {
  const lastId = localStorage.getItem("last-choreo")
  return loadChoreo("choreo-" + lastId)
}

function loadChoreo(key: string) {
  const choreoJson = localStorage.getItem(key || "-")
  if (!choreoJson) return
  const choreo = JSON.parse(choreoJson) as Choreography
  if (!choreo.name || !choreo.created || !choreo.images) return
  return choreo
}

export function findLocalChoreos() {
  const choreos: Choreography[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key?.startsWith("choreo-")) continue
    const choreo = loadChoreo(key)
    if (choreo) choreos.push(choreo)
  }
  return choreos.sort((a, b) => b.lastModified - a.lastModified)
}

type TimeProvider = () => number

interface ChoreoStoreType {
  unselect(): void
  selectAll(x1: number, y1: number, x2: number, y2: number): void
  onPointerDown(id: number, point: Vector3, distance: number): void
  getChoreoAnimatedPosition(
    id: number,
    elapsedTime: number
  ): {
    male: [number, number]
    female: [number, number]
    positionAnimation: number
  }
  onPointerUp(): void
  dragTo(x: number, y: number): void
  timeProvider?: TimeProvider
  setTimeProvider: (provider: TimeProvider) => void

  choreo: Choreography
  setChoreo: (choreo: Partial<Choreography>) => void
  setChoreoName: (newName: string) => void
  mapPositionIndexes<T>(callback: (idx: number) => T): T[]

  currentImage: number

  selectedIds: number[]
  selectionRect?: { x1: number; y1: number; x2: number; y2: number }
  downOnPlane?: {
    x: number
    y: number
  }
  onPlanePointerDown: (pos: { x: number; y: number }) => void
  downOnPosition?: {
    id: number
    z: number
    offsetX: number
    offsetY: number
    distance: number
  }
  draggedPositions?: {
    positions: ImagePositions
    indexAssignment: number[]
  }
  positionsOnDragStart?: [number, number][]

  addImage: (id?: number) => void
  removeImage: (id?: number) => void
  nextImage: () => void
  prevImage: () => void
  reanimateImage: () => void
  setImage: (id: number, forceAnimation?: boolean) => void
  moveImage: (id: number, newId: number) => void
  toggleImageEnabled: (id: number) => void
  setImageName: (id: number, name: string) => void

  finishImageAnimation: number
  isAnimationFinished: (elapsedTime?: number) => boolean

  getChoreoPosition: (id: number) => [number, number]
  getChoreoPreviousPosition: (id: number) => [number, number]
  getChoreoPositions: (positions?: [number, number][]) => [number, number][]
  getChoreoPreviousPositions: (positions?: [number, number][]) => [number, number][]

  undoStack: Choreography[]
  redoStack: Choreography[]

  undo(): void
  redo(): void
  canUndo(): boolean
  canRedo(): boolean
}

const useChoreoStore = create(
  subscribeWithSelector<
    ChoreoStoreType,
    SetState<ChoreoStoreType>,
    GetState<ChoreoStoreType>,
    StoreApiWithSubscribeWithSelector<ChoreoStoreType>
  >((set, get) => ({
    choreo: newChoreo(),
    currentImage: 0,

    selectedIds: [],

    setChoreo: (choreoToSet) => {
      const choreo = { ...newChoreo(), ...choreoToSet }
      set(() => ({
        choreo,
        currentImage: 0,
        redoStack: [],
        undoStack: [],
      }))
      saveLocal(choreo)
    },

    setChoreoName: (name) =>
      set(
        modifyAndSafe((s) => {
          s.choreo.name = name
        })
      ),

    setTimeProvider: (timeProvider) => set(() => ({ timeProvider })),

    moveImage: (id, newId) => {
      set(
        modifyAndSafe((state) => {
          const image = state.choreo.images[id]
          if (id >= 0 && newId >= 0 && id < state.choreo.images.length && id < state.choreo.images.length && image) {
            const slice1 = state.choreo.images.slice(0, id)
            const slice2 = state.choreo.images.slice(id + 1)

            state.choreo.images = [...slice1, ...slice2]
            state.choreo.images.splice(newId, 0, image)
          }
        })
      )
    },

    toggleImageEnabled(id) {
      set(
        modifyAndSafe((state) => {
          const image = state.choreo.images[id]
          if (image) image.disabled = !image.disabled
        })
      )
    },

    setImageName(id, name) {
      set(
        modifyAndSafe((state) => {
          const image = state.choreo.images[id]
          if (image) image.name = name
          state.choreo.lastModified = Date.now()
        })
      )
    },

    removeImage: (id) =>
      set(
        modifyAndSafe((state) => {
          const image = state.choreo.images[id ?? state.currentImage]
          if (image && state.choreo.images.length > 1) state.choreo.images.splice(id ?? state.currentImage, 1)
          if (state.currentImage >= state.choreo.images.length) state.currentImage = state.choreo.images.length - 1
        })
      ),
    addImage: (id) =>
      set(
        modifyAndSafe((state) => {
          const image = state.choreo.images[id ?? state.currentImage]
          if (image) {
            state.choreo.images.splice(id ?? state.currentImage + 1, 0, {
              positions: image.positions,
            })
            state.currentImage++
          } else {
            state.choreo.images.push(defaultImage())
          }
        })
      ),
    setImage: (id: number, forceAnimation: boolean = false) => {
      if (id >= 0 && id < get().choreo.images.length) {
        set(
          produce<ChoreoStoreType>((state) => {
            const prevImage = getPreviousImage(state.choreo.images, id)
            const finishImageAnimation =
              (forceAnimation || state.currentImage == prevImage) && state.timeProvider ? state.timeProvider() + 1 : 0

            state.currentImage = id
            state.finishImageAnimation = finishImageAnimation
          })
        )
      }
    },

    nextImage: () => {
      const state = get()
      state.setImage(getNextImage(state.choreo.images, state.currentImage))
    },
    prevImage: () => {
      const state = get()
      state.setImage(getPreviousImage(state.choreo.images, state.currentImage))
    },
    reanimateImage: () => get().setImage(get().currentImage, true),

    finishImageAnimation: 0,
    isAnimationFinished: (elapsedTime) => ((elapsedTime ?? get().timeProvider?.()) || 0) > get().finishImageAnimation,

    getChoreoPositions: (customPositions?: [number, number][]) => {
      const state = get()
      const positions =
        customPositions ||
        state.draggedPositions?.positions ||
        state.choreo.images[state.currentImage]?.positions ||
        defaultImage().positions
      return calculatePositions(positions, state.choreo.persons)
    },

    getChoreoPreviousPositions: () => {
      const state = get()
      const prevImage = getPreviousImage(state.choreo.images, state.currentImage)
      const image = state.choreo.images[prevImage]
      if (!image) return state.getChoreoPositions()
      else return state.getChoreoPositions(image.positions)
    },

    getChoreoPosition: (id: number) => {
      const state = get()
      return (
        state.draggedPositions?.positions?.[id] ||
        state.choreo.images[state.currentImage]?.positions[id] ||
        defaultPosition(id)
      )
    },

    getChoreoPreviousPosition: (id: number) => {
      const state = get()
      const prevId = getPreviousImage(state.choreo.images, state.currentImage)
      return state.choreo.images[prevId]?.positions[id] || defaultPosition(id)
    },

    getChoreoAnimatedPosition: (id, elapsedTime) => {
      const state = get()
      const lambda = clamp(1 - state.finishImageAnimation + elapsedTime, 0, 1)

      const newPosition = state.getChoreoPosition(id * 2)
      const newPositionFemale = state.getChoreoPosition(id * 2 + 1)
      const newPositionSamePosition = deepEqual(newPosition, newPositionFemale) ? 0 : 1
      if (lambda > 1 || state.currentImage == 0)
        return {
          male: newPosition,
          female: newPositionFemale,
          positionAnimation: newPositionSamePosition,
        }
      const oldPosition = state.getChoreoPreviousPosition(id * 2)
      const oldPositionFemale = state.getChoreoPreviousPosition(id * 2 + 1)
      const oldPositionSamePosition = deepEqual(oldPosition, oldPositionFemale) ? 0 : 1

      return {
        male: [
          oldPosition[0] * (1 - lambda) + newPosition[0] * lambda,
          oldPosition[1] * (1 - lambda) + newPosition[1] * lambda,
        ],
        female: [
          oldPositionFemale[0] * (1 - lambda) + newPositionFemale[0] * lambda,
          oldPositionFemale[1] * (1 - lambda) + newPositionFemale[1] * lambda,
        ],
        positionAnimation: Math.pow(oldPositionSamePosition * (1 - lambda) + newPositionSamePosition * lambda, 2),
      }
    },

    onPlanePointerDown: (pos) => set(() => ({ downOnPlane: pos })),

    onPointerDown: (id: number, position: Vector3, distance: number) => {
      const selectionMode = useSettingsStore.getState().selectionMode
      const state = get()
      const currentPositions = klona(state.getChoreoPositions())
      const currentPosition = currentPositions[id]
      if (!currentPosition) return

      const selectedIds: number[] = []
      for (let i = 0; i < state.choreo.persons; i++) {
        for (let x = 0; x < 2; x++) {
          const idx = i * 2 + x
          if (
            currentPositions[idx] &&
            (selectionMode == "both" ||
              (idx % 2 == 0 && selectionMode == "male") ||
              (idx % 2 == 1 && selectionMode == "female")) &&
            (selectedIds.length == 0 || Math.floor((selectedIds[0] || 0) / 2) == Math.floor(idx / 2)) &&
            deepEqual(currentPosition, currentPositions[idx])
          ) {
            selectedIds.push(idx)
          }
        }
      }
      if (!selectedIds.length) return

      set(
        produce<ChoreoStoreType>((state) => {
          if ((state.downOnPosition?.distance || 1000) < distance) return
          if (selectedIds.find((s) => [...state.selectedIds].indexOf(s) < 0) !== undefined)
            state.selectedIds = selectedIds

          state.downOnPosition = {
            id,
            z: position.z,
            distance,
            offsetX: position.x - currentPosition[0] / 100,
            offsetY: position.y - -currentPosition[1] / 100,
          }

          if (useSettingsStore.getState().locked) state.positionsOnDragStart = undefined
          else state.positionsOnDragStart = currentPositions
        })
      )
    },

    mapPositionIndexes: (callback) => {
      const state = get()
      const ret = Array(state.choreo.persons * 2)
      for (let i = 0; i < state.choreo.persons; i++) {
        for (let x = 0; x < 2; x++) {
          ret.push(callback(i * 2 + x))
        }
      }
      return ret
    },

    selectAll: (x1, y1, x2, y2) =>
      set((s) => {
        const selectionMode = useSettingsStore.getState().selectionMode
        const position = s.getChoreoPositions()
        let selectedIds = s
          .mapPositionIndexes((i) => {
            if (
              selectionMode == "both" ||
              (selectionMode == "male" && i % 2 == 0) ||
              (selectionMode == "female" && i % 2 == 1)
            ) {
              const x = (position[i]?.[0] ?? -100000) / 100
              const y = (position[i]?.[1] ?? -100000) / -100
              return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? i : -1
            }
            return -1
          })
          .filter((i) => i >= 0)
        return { selectedIds, selectionRect: { x1, y1, x2, y2 } }
      }),

    unselect: () => set(() => ({ selectedIds: [] })),

    dragTo: (x: number, y: number) => {
      const state = get()
      const image = state.choreo.images[state.currentImage]
      const gridSize = useSettingsStore.getState().gridSize
      if (state.downOnPosition && image && state.positionsOnDragStart) {
        const positions = [...state.positionsOnDragStart]
        const newX = clamp(
          Math.round(((x - state.downOnPosition.offsetX) * 100) / gridSize) * gridSize,
          -state.choreo.floor.width * 100,
          state.choreo.floor.width * 100
        )
        const newY = clamp(
          -Math.round(((y - state.downOnPosition.offsetY) * 100) / gridSize) * gridSize,
          -state.choreo.floor.height * 100,
          state.choreo.floor.height * 100
        )

        const positionOriginX = positions[state.downOnPosition.id]?.[0] || 0
        const positionOriginY = positions[state.downOnPosition.id]?.[1] || 0

        const indexAssignment: number[] = []
        state.mapPositionIndexes((i) => (indexAssignment[i] = i))

        for (const downId of state.selectedIds) {
          const idxToSwap =
            state
              .mapPositionIndexes((idx) => {
                const i = positions[idx]
                return !!i &&
                  idx !== downId &&
                  idx % 2 === downId % 2 &&
                  i[0] == newX &&
                  i[1] == newY &&
                  state.selectedIds.find((x) => Math.floor(idx / 2) === Math.floor(x / 2)) === undefined
                  ? idx
                  : -1
              })
              .filter((i) => i >= 0)[0] ?? -1

          if (idxToSwap >= 0) {
            positions[idxToSwap] = positions[downId] ?? [0, 0]
            indexAssignment[idxToSwap] = downId
            indexAssignment[downId] = idxToSwap
          }
          const selectedOffsetX = (positions[downId]?.[0] || 0) - positionOriginX
          const selectedOffsetY = (positions[downId]?.[1] || 0) - positionOriginY

          positions[downId] = [newX + selectedOffsetX, newY + selectedOffsetY]
        }
        if (!deepEqual(state.draggedPositions, positions))
          set(
            produce<ChoreoStoreType>((state) => {
              state.draggedPositions = { positions, indexAssignment }
            })
          )
      }
    },
    onPointerUp: () => {
      const state = get()
      if (state.draggedPositions)
        set(
          modifyAndSafe((state) => {
            const image = state.choreo.images[state.currentImage]
            state.downOnPosition = undefined
            state.downOnPlane = undefined
            state.selectionRect = undefined

            if (!state.draggedPositions) return
            if (image) image.positions = state.draggedPositions.positions
            for (let i = state.currentImage + 1; i < state.choreo.images.length; i++) {
              const nextImage = state.choreo.images[i]
              if (nextImage) {
                const originalPositions = [...nextImage.positions]
                for (const pos of state.mapPositionIndexes((i) => i)) {
                  const newPos = originalPositions[state.draggedPositions?.indexAssignment[pos] ?? pos]
                  if (newPos) nextImage.positions[pos] = newPos
                }
              }
            }
            state.draggedPositions = undefined
          })
        )
      else
        set(
          produce<ChoreoStoreType>((state) => {
            state.downOnPosition = undefined
            state.downOnPlane = undefined
            state.selectionRect = undefined
          })
        )
    },

    undoStack: [],
    redoStack: [],
    canRedo: () => !!get().redoStack.length,
    canUndo: () => !!get().undoStack.length,
    undo: () =>
      set(
        modifyAndSafe(
          (s) => {
            const undoChoreo = s.undoStack.pop()
            if (undoChoreo) {
              s.redoStack.push(klona(s.choreo))
              s.choreo = klona(undoChoreo)
            } else return false
          },
          { undoable: false }
        )
      ),
    redo: () =>
      set(
        modifyAndSafe(
          (s) => {
            const redoChoreo = s.redoStack.pop()
            if (redoChoreo) {
              s.undoStack.push(klona(s.choreo))
              s.choreo = klona(redoChoreo)
            } else return false
          },
          { undoable: false }
        )
      ),
  }))
)

useChoreoStore.getState().setChoreo(load() || newChoreo())

function modifyAndSafe(callback: (s: Draft<ChoreoStoreType>) => boolean | void, options?: { undoable: boolean }) {
  return produce<ChoreoStoreType>((s) => {
    if (options?.undoable !== false) {
      if (s.undoStack.length >= 10) {
        s.undoStack.splice(0, 1)
      }
      s.undoStack.push(klona(s.choreo))
      s.redoStack = []
    }
    if (callback(s) == false) return
    s.choreo.lastModified = Date.now()
    saveLocal(s.choreo)
  })
}
function saveLocal(choreo: Choreography) {
  localStorage.setItem("last-choreo", choreo.name)
  localStorage.setItem("choreo-" + choreo.name, JSON.stringify(choreo))
}

function defaultPosition(id: number): [number, number] {
  return [(Math.floor(id / 2) - 6) * 100, 0]
}

function defaultImage(): Image {
  return {
    positions: [],
  }
}

export function calculatePositions(positions: [number, number][], persons: number) {
  const res = []
  for (let i = 0; i < persons; i++) {
    res[i * 2] = positions[i * 2] || defaultPosition(i * 2)
    res[i * 2 + 1] = positions[i * 2 + 1] || defaultPosition(i * 2)
  }
  return res
}

function getPreviousImage(images: Image[], index: number) {
  for (let i = index - 1; i >= 0; i--) {
    if (images[i]?.disabled) continue
    else return i
  }
  return index
}

function getNextImage(images: Image[], index: number) {
  for (let i = index + 1; i < images.length; i++) {
    if (images[i]?.disabled) continue
    else return i
  }
  return index
}

export default useChoreoStore

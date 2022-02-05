import { Camera } from "three"
import { clamp } from "three/src/math/MathUtils"
import create from "zustand"

export interface CamStoreType {
  zoomFactor: number
  camPosition: number
  camX: number
  camY: number
  zoom: number
  camera?: Camera

  modifyPosition: (delta: number) => void
  modifyOffset: (deltaX: number, deltaY: number) => void
  modifyZoom: (delta: number) => void
  modifyZoomFactor: (delta: number) => void
  getCameraPosition(): [number, number, number]

  backView: boolean
  toggleBackView(): void
}

const useCameraStore = create<CamStoreType>((set, get) => ({
  zoomFactor: 1,
  camPosition: 0.4,
  camX: 0,
  camY: 0,
  zoom: 1,

  modifyPosition: (delta) => set((state) => ({ camPosition: clamp(state.camPosition + delta, 0, 1) })),
  modifyZoom: (delta) => set((state) => ({ zoom: clamp(state.zoom * delta, 0.1, 100) })),
  modifyZoomFactor: (zoomFactor) => set(() => ({ zoomFactor })),
  modifyOffset: (deltaX, deltaY) =>
    set((state) => ({
      camX: clamp(state.camX + deltaX, -10, 10),
      camY: clamp(state.camY + deltaY, -10, 10),
    })),

  getCameraPosition() {
    const state = get()
    return [
      state.camX,
      (state.backView ? -1 : 1) * Math.sin(Math.PI * (0.2 + state.camPosition * 0.8)) * -60 + state.camY,
      Math.sin((Math.PI / 2) * state.camPosition) * 50 + 3,
    ]
  },

  backView: false,
  toggleBackView: () => set((state) => ({ backView: !state.backView })),
}))

export default useCameraStore

import deepEqual from "fast-deep-equal"
import create, { GetState, SetState } from "zustand"
import { StoreApiWithSubscribeWithSelector, subscribeWithSelector } from "zustand/middleware"
import useChoreoStore from "./useChoreoStore"

interface OverlayStoreType {
  xPositions: number[]
  yPositions: number[]
  minX: number
  maxX: number
  minY: number
  maxY: number
}

const useOverlayStore = create(
  subscribeWithSelector<
    OverlayStoreType,
    SetState<OverlayStoreType>,
    GetState<OverlayStoreType>,
    StoreApiWithSubscribeWithSelector<OverlayStoreType>
  >(() => ({
    xPositions: [],
    yPositions: [],
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
  }))
)

useChoreoStore.subscribe(
  (s) => s.getChoreoPositions(),
  (positions) => {
    const xPositions = new Set<number>()
    const yPositions = new Set<number>()

    let maxX = 100000,
      maxY = 100000,
      minX = -100000,
      minY = -100000

    for (let i = 0; i < positions.length; i++) {
      for (let x = 0; x < 2; x++) {
        const p = positions[i * 2 + x]
        if (!p) continue
        xPositions.add(p[0])
        yPositions.add(p[1])
        minY = Math.max(minY, -p[1])
        maxY = Math.min(maxY, -p[1])
        minX = Math.max(minX, p[0])
        maxX = Math.min(maxX, p[0])
      }
    }

    useOverlayStore.setState({
      xPositions: [...xPositions.values()],
      yPositions: [...yPositions.values()],
      minX,
      maxX,
      minY,
      maxY,
    })
  },
  { fireImmediately: true, equalityFn: deepEqual }
)

export default useOverlayStore

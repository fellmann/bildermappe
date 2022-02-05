import { useEffect, useMemo, useRef } from "react"
import { LineSegments, Vector3 } from "three"
import deepEqual from "fast-deep-equal"
import useChoreoStore from "../../store/useChoreoStore"

export const DragHelperLine = () => {
  const lineX = useRef<LineSegments>()
  const lineY = useRef<LineSegments>()
  const points = useRef({
    x1: new Vector3(),
    x2: new Vector3(),
    y1: new Vector3(),
    y2: new Vector3(),
  })

  useEffect(
    () =>
      useChoreoStore.subscribe(
        (store) => ({
          downPosition: store.downOnPosition ? store.getChoreoPosition(store.downOnPosition.id) : undefined,
          floor: store.choreo.floor,
        }),
        (store) => {
          if (!lineX.current || !lineY.current) return
          if (!store.downPosition) {
            lineX.current.visible = false
            lineY.current.visible = false
          } else {
            const pos = store.downPosition
            const x = pos[0] / 100
            const y = -pos[1] / 100
            points.current.x1.set(-store.floor.width, y, 0.02)
            points.current.x2.set(store.floor.width, y, 0.02)
            points.current.y1.set(x, -store.floor.height, 0.02)
            points.current.y2.set(x, store.floor.height, 0.02)
            lineX.current.visible = true
            lineY.current.visible = true
            lineX.current.geometry.setFromPoints([points.current.x1, points.current.x2])
            lineY.current.geometry.setFromPoints([points.current.y1, points.current.y2])
          }
        },
        { equalityFn: deepEqual }
      ),
    []
  )
  return (
    <>
      <lineSegments ref={lineX}>
        <bufferGeometry />
        <lineBasicMaterial color={"#f0f"} linewidth={1} />
      </lineSegments>
      <lineSegments ref={lineY}>
        <bufferGeometry />
        <lineBasicMaterial color={"#f0f"} linewidth={1} />
      </lineSegments>
    </>
  )
}

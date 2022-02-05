import { invalidate, useThree } from "@react-three/fiber"
import { useLayoutEffect, useRef } from "react"
import { LineSegments, Vector3 } from "three"

export function Line({
  start,
  end,
  color,
}: {
  start: [number, number, number]
  end: [number, number, number]
  color: string
}) {
  const ref = useRef<LineSegments>()
  const points = useRef({ start: new Vector3(), end: new Vector3() })
  const invalidate = useThree((s) => s.invalidate)
  useLayoutEffect(() => {
    points.current.start.set(...start)
    points.current.end.set(...end)
    ref.current?.geometry.setFromPoints([points.current.start, points.current.end])
    ref.current?.geometry.computeBoundingSphere()
    invalidate()
  }, [start, end])
  return (
    <lineSegments ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color={color} />
    </lineSegments>
  )
}

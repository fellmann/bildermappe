import { Html } from "@react-three/drei"
import { useEffect, useRef } from "react"
import { Group } from "three"
import shallow from "zustand/shallow"
import useCameraStore from "../../store/useCameraStore"
import useOverlayStore from "../../store/useOverlayStore"

const Overlay = ({ i, type }: { i: number; type: "x" | "y" }) => {
  const ref = useRef<Group>(null)
  const div = useRef<HTMLDivElement>(null)

  useEffect(
    () =>
      useOverlayStore.subscribe(
        type == "x"
          ? (s) => ({
              pos: s.xPositions[i] || 0,
            })
          : (s) => ({
              pos: s.yPositions[i] || 0,
            }),
        (s) => {
          const text = Math.abs(s.pos / 100).toLocaleString()
          const x = type == "x" ? s.pos : 0
          const y = type == "y" ? s.pos : 0
          if (div.current && div.current.innerText != text) div.current.innerText = text
          if (ref.current) ref.current.position.set(x / 100, y / -100, 0)
        },
        { equalityFn: shallow, fireImmediately: true }
      ),
    []
  )

  return (
    <group ref={ref}>
      <Html zIndexRange={[0, 0]} ref={div} className={"position-overlay-" + type}></Html>
    </group>
  )
}

export const PositionTexts = function () {
  const overlayStore = useOverlayStore(
    (s) => ({
      xCount: s.xPositions.length,
      yCount: s.yPositions.length,
      minX: s.minX,
      maxX: s.maxX,
      minY: s.minY,
      maxY: s.maxY,
    }),
    shallow
  )

  const reverse = useCameraStore((s) => s.backView)

  const elementsX = []
  const elementsY = []
  for (let i = 0; i < overlayStore.xCount; i++) elementsX.push(<Overlay type="x" i={i} key={i} />)
  for (let i = 0; i < overlayStore.yCount; i++) elementsY.push(<Overlay type="y" i={i} key={i + 10000} />)
  const offsetX = reverse ? overlayStore.minY / 100 + 1 : overlayStore.maxY / 100 - 1
  const offsetY = reverse ? overlayStore.minX / 100 + 1 : overlayStore.maxX / 100 - 1
  return (
    <>
      <group position={[0, offsetX, 0]}>{elementsX}</group>
      <group position={[offsetY, 0, 0]}>{elementsY}</group>
    </>
  )
}

import { Html } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import deepEqual from "fast-deep-equal"
import { useRef, useState } from "react"
import { MeshLambertMaterial } from "three"
import useChoreoStore from "../../store/useChoreoStore"
import useSettingsStore from "../../store/useSettingsStore"

function mergeColors(c1: number[], c2: number[], factor: number): [number, number, number] {
  return [
    (c2[0] || 0) * factor + (c1[0] || 0) * (1 - factor),
    (c2[1] || 0) * factor + (c1[1] || 0) * (1 - factor),
    (c2[2] || 0) * factor + (c1[2] || 0) * (1 - factor),
  ]
}

export function Person(props: { id: number }) {
  const refGroup = useRef<THREE.Group>(null)
  const refNumberHtml = useRef<HTMLDivElement>(null)
  const refMaterial1 = useRef<MeshLambertMaterial>(null)
  const refMaterial2 = useRef<MeshLambertMaterial>(null)
  const [hovered, hover] = useState(false)
  const invalidate = useThree((s) => s.invalidate)

  useChoreoStore.subscribe(
    (s) => ({ position: s.getChoreoPosition(props.id), timer: s.finishImageAnimation }),
    invalidate,
    { equalityFn: deepEqual }
  )

  const choreoStore = useChoreoStore(
    (s) => ({
      onPointerDown: s.onPointerDown,
      selected: s.selectedIds.indexOf(props.id) >= 0,
      selectedFemale: s.selectedIds.indexOf(props.id - (props.id % 2) + 1) >= 0,
    }),
    deepEqual
  )

  useFrame((state) => {
    if (!refMaterial1.current || !refMaterial2.current || !refGroup.current || !refNumberHtml.current) return
    const store = useChoreoStore.getState()
    const positions = store.getChoreoAnimatedPosition(Math.floor(props.id / 2), state.clock.elapsedTime)
    const clicked = choreoStore.selected || (positions.positionAnimation == 0 && choreoStore.selectedFemale)

    const colorCode = clicked ? 1 : hovered ? 0.75 : 0.5
    const color: [number, number, number] = mergeColors(
      [colorCode, 0, colorCode],
      props.id % 2 == 0 ? [colorCode / 8, colorCode / 12, colorCode] : [colorCode, colorCode / 16, colorCode / 16],
      positions.positionAnimation
    )

    if (props.id % 2 == 1 && positions.positionAnimation == 0) {
      refGroup.current.visible = false
      refNumberHtml.current.style.display = "none"
    } else {
      const position = props.id % 2 == 0 ? positions.male : positions.female
      refGroup.current?.position.set(position[0] / 100, -position[1] / 100, 0)
      refMaterial1.current.color.setRGB(...color)
      refMaterial2.current.color.setRGB(...color)
      refNumberHtml.current.style.display = "block"
      refGroup.current.visible = true
    }

    if (!store.isAnimationFinished(state.clock.elapsedTime)) state.invalidate()
  })

  return (
    <>
      <group
        ref={refGroup}
        onPointerDown={(event) => {
          if (refGroup.current?.visible) {
            event.stopPropagation()
            choreoStore.onPointerDown(props.id, event.point, event.distance)
          }
        }}
        onPointerOver={(event) => {
          if (refGroup.current?.visible) {
            event.stopPropagation()
            hover(true)
          }
        }}
        onPointerOut={(event) => {
          if (refGroup.current?.visible) {
            event.stopPropagation()
            hover(false)
          }
        }}
      >
        <mesh position={[0, 0, 0.6]} scale={[0.8, 0.9, 1.2]}>
          <sphereGeometry args={[0.5, 24, 16]} />
          <meshLambertMaterial ref={refMaterial1} />
        </mesh>
        <mesh position={[0, 0, 1.3]} scale={[0.5, 0.5, 0.5]}>
          <sphereGeometry args={[0.5, 24, 8]} />
          <meshLambertMaterial ref={refMaterial2} />
        </mesh>
        <Html zIndexRange={[0, 0]} ref={refNumberHtml} position={[0, 0, 0.75]} style={{ pointerEvents: "none" }}>
          <div className="text-overlay">{Math.floor(props.id / 2) + 1}</div>
        </Html>
      </group>
    </>
  )
}

import useViewStore from "../store/useViewStore"
import { Canvas } from "@react-three/fiber"
import { useLayoutEffect, useRef } from "react"
import FloorLights from "./FloorLights"
import { CameraControlSetup } from "./interaction/CameraControlSetup"
import { BasePlane } from "./objects/BasePlane"
import { Markers } from "./objects/Markers"
import { Persons } from "./objects/Persons"
import { AnimationLine } from "./overlays/AnimationLine"
import { DragHelperLine } from "./overlays/DragHelperLine"
import { FloorLines } from "./overlays/FloorLines"
import { PositionTexts } from "./overlays/PositionTexts"
import { SelectionRect } from "./overlays/SelectionRect"

export default function FloorSetup() {
  const canvas = useRef<HTMLCanvasElement>(null)
  useLayoutEffect(() => {
    if (canvas.current) {
      canvas.current?.parentElement?.classList?.add("fade-in")
    }
  }, [])

  return (
    <Canvas frameloop="demand" ref={canvas} className="fade-parent" gl={{ antialias: true }}>
      <CameraControlSetup />
      <FloorLights />
      <BasePlane />
      <FloorLines />
      <DragHelperLine />
      <AnimationLine />
      <SelectionRect />
      <PositionTexts />
      <Markers />
      <Persons />
    </Canvas>
  )
}

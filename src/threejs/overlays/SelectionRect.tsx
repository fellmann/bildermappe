import { useRef } from "react"
import { Color, Group } from "three"
import shallow from "zustand/shallow"
import useChoreoStore from "../../store/useChoreoStore"
import { Line } from "../objects/Line"

const blue = new Color("#00f")

export const SelectionRect = () => {
  const rect = useChoreoStore((store) => store.selectionRect, shallow)

  return !!rect ? (
    <>
      <Line start={[rect.x1, rect.y1, 0.02]} end={[rect.x1, rect.y2, 0.02]} color="#00f" />
      <Line start={[rect.x1, rect.y2, 0.02]} end={[rect.x2, rect.y2, 0.02]} color="#00f" />
      <Line start={[rect.x2, rect.y2, 0.02]} end={[rect.x2, rect.y1, 0.02]} color="#00f" />
      <Line start={[rect.x2, rect.y1, 0.02]} end={[rect.x1, rect.y1, 0.02]} color="#00f" />
    </>
  ) : null
}

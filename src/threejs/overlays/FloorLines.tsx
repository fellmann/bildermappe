import useChoreoStore from "../../store/useChoreoStore"
import { Line } from "../objects/Line"
import deepEqual from "fast-deep-equal"

export function FloorLines() {
  const floor = useChoreoStore((state) => state.choreo.floor, deepEqual)

  const color = (i: number, b: number) => (b == i ? "#654" : Math.abs((-b + i) % 2) == 1 ? "#ba9" : "#987")

  return (
    <>
      {[...Array(floor.height * 2 + 1)].map((_, i) => (
        <Line
          key={i}
          start={[-floor.width, -floor.height + i, 0.0]}
          end={[floor.width, -floor.height + i, 0.0]}
          color={color(i, floor.height)}
        />
      ))}
      {[...Array(floor.width * 2 + 1)].map((_, i) => (
        <Line
          key={i}
          start={[-floor.width + i, -floor.height, 0.0]}
          end={[-floor.width + i, floor.height, 0.0]}
          color={color(i, floor.width)}
        />
      ))}
    </>
  )
}

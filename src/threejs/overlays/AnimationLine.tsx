import { useRef } from "react"
import { LineSegments } from "three"
import useChoreoStore from "../../store/useChoreoStore"
import { Line } from "../objects/Line"
import deepEqual from "fast-deep-equal"

export const AnimationLine = () => {
  const { positions, lastPositions, mapPositionIndexes, selectedIds } = useChoreoStore(
    (s) => ({
      positions: s.getChoreoPositions(),
      lastPositions: s.getChoreoPreviousPositions(),
      mapPositionIndexes: s.mapPositionIndexes,
      selectedIds: s.selectedIds,
    }),
    deepEqual
  )

  return (
    <>
      {mapPositionIndexes((i) => {
        const position = positions[i]
        const lastPosition = lastPositions[i]
        if (!lastPosition || !position) return null
        if (selectedIds.indexOf(i) < 0) return null
        const same =
          deepEqual(positions[i - (i % 2)], positions[i - (i % 2) + 1]) &&
          deepEqual(lastPositions[i - (i % 2)], lastPositions[i - (i % 2) + 1])
        if (same && i % 2 == 1) return null
        const color = same ? "#a0a" : i % 2 == 0 ? "#00a" : "#a00"
        return (
          <Line
            key={i}
            start={[lastPosition[0] / 100, lastPosition[1] / -100, i % 2 == 1 ? 0.04 : 0.02]}
            end={[position[0] / 100, position[1] / -100, i % 2 == 1 ? 0.04 : 0.02]}
            color={color}
          />
        )
      })}
    </>
  )
}

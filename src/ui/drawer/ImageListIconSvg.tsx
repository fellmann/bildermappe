import deepEqual from "fast-deep-equal"
import { useCallback } from "react"
import useChoreoStore from "../../store/useChoreoStore"

export const ImageListIconSvg = (props: { index: number }) => {
  const { image, getChoreoPositions, persons, floor } = useChoreoStore(
    useCallback(
      (s) => ({
        image: s.choreo.images[props.index],
        getChoreoPositions: s.getChoreoPositions,
        floor: s.choreo.floor,
        persons: s.choreo.persons,
      }),
      [props.index]
    ),
    deepEqual
  )

  if (!image) return null

  const positions = getChoreoPositions(image.positions)

  return <ImageListIconSvgPositions persons={persons} floor={floor} positions={positions} />
}

export function ImageListIconSvgPositions({
  persons,
  positions,
  floor,
}: {
  floor: { height: number; width: number }
  persons: number
  positions: [number, number][]
}) {
  const circles = []
  for (let pi = 0; pi < persons; pi++) {
    const p = positions[pi * 2]
    const p2 = positions[pi * 2 + 1]
    if (p && p2) {
      if (deepEqual(p, p2)) {
        circles.push(<circle fill="#a0a" cx={p[0] / 100} cy={p[1] / 100} r={0.4} key={pi} />)
      } else {
        circles.push(
          <circle fill="#00a" cx={p[0] / 100} cy={p[1] / 100} r={0.4} key={pi * 2} />,
          <circle fill="#a00" cx={p2[0] / 100} cy={p2[1] / 100} r={0.4} key={pi * 2 + 1} />
        )
      }
    }
  }

  const viewPort = `-${floor.width + 1} -${floor.height + 1} ${floor.width * 2 + 2} ${floor.height * 2 + 2}`
  return (
    <svg viewBox={viewPort} style={{ width: "3em", height: "3em" }}>
      {circles}
    </svg>
  )
}

import useChoreoStore from "../../store/useChoreoStore"
import deepEqual from "fast-deep-equal"
import { Marker } from "./Marker"
import { Fragment } from "react"

export function Markers() {
  const floor = useChoreoStore((state) => state.choreo.floor, deepEqual)

  return (
    <>
      {[...Array(5)].map((_, i) => (
        <Fragment key={i}>
          <Marker x={-6 + i * 3} y={-floor.height} />
          <Marker x={-6 + i * 3} y={floor.height} />
          <Marker y={-6 + i * 3} x={-floor.width} />
          <Marker y={-6 + i * 3} x={floor.width} />
        </Fragment>
      ))}
    </>
  )
}

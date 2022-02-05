import { Plane } from "@react-three/drei"
import deepEqual from "fast-deep-equal"
import useChoreoStore from "../../store/useChoreoStore"

export function BasePlane() {
  const choreoStore = useChoreoStore(
    (s) => ({ floor: s.choreo.floor, onPlanePointerDown: s.onPlanePointerDown }),
    deepEqual
  )

  return (
    <>
      <Plane
        args={[choreoStore.floor.width * 2, choreoStore.floor.height * 2]}
        onPointerDown={(e) => {
          if (choreoStore) choreoStore.onPlanePointerDown(e.point)
        }}
      >
        <meshLambertMaterial color="#fca" depthWrite={false} />
      </Plane>
      <Plane args={[1, 0.1]}>
        <meshBasicMaterial color="#654" />
      </Plane>
      <Plane args={[0.1, 1]}>
        <meshBasicMaterial color="#654" />
      </Plane>
    </>
  )
}

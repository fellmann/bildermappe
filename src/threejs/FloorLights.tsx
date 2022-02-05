import shallow from "zustand/shallow"
import useChoreoStore from "../store/useChoreoStore"

export default function FloorLights() {
  const floor = useChoreoStore((s) => s.choreo.floor, shallow)
  const fac = Math.sqrt(floor.width * floor.width + floor.height * floor.height * 4)
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, -floor.height * 1.5, 10]} power={30} distance={fac * 2} />
    </>
  )
}

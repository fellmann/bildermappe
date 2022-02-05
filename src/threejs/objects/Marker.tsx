import { Line } from "./Line"

export function Marker(props: { x: number; y: number }) {
  const scale = props.x == 0 || props.y == 0 ? 0.8 : 0.5

  return (
    <>
      <mesh position={[props.x, props.y, 0.3 + scale / 2]} scale={[scale, scale, scale * 2]}>
        <sphereGeometry args={[0.3, 16, 8]} />
        <meshLambertMaterial color="#6c0" />
      </mesh>
      <Line start={[props.x, props.y, 0.0]} end={[props.x, props.y, 0.3]} color={"#654"} />
    </>
  )
}

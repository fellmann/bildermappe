import { Vector3 } from "three"
const vec = new Vector3()

export default function (
  x: number,
  y: number,
  domElement: HTMLElement,
  camera: THREE.Camera,
  pos: Vector3,
  targetZ: number = 0
) {
  vec.set((x / domElement.clientWidth) * 2 - 1, -(y / domElement.clientHeight) * 2 + 1, 0.5)

  vec.unproject(camera)

  vec.sub(camera.position).normalize()
  var distance = (targetZ - camera.position.z) / vec.z

  pos.copy(camera.position).add(vec.multiplyScalar(distance))
  return pos
}

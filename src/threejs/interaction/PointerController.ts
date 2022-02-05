import debounceFn from "debounce-fn"
import distance2 from "../helpers/distance2"

interface Point {
  x: number
  y: number
}

interface PointDistance {
  distance: number
  center: Point
}

export default (
  domElement: HTMLElement,
  props: {
    onClick?: () => void
    onClear?: () => void
    onDrag?: (from: Point, to: Point, origin: Point) => void
    onZoomDrag?: (from: PointDistance, to: PointDistance) => void
    onZoom?: (center: Point, factor: number) => void
    onAcceptDown?: (center: Point) => boolean | undefined
  }
) => {
  const elementOffset = { x: 0, y: 0 }

  const lastPointerPosition: Map<number, Point> = new Map()
  const firstPointerPosition: Map<number, Point> = new Map()
  const updateElementOffsetFn = () => {
    const boundingBox = (domElement as HTMLElement)?.getBoundingClientRect()
    elementOffset.x = boundingBox.x
    elementOffset.y = boundingBox.y
  }
  updateElementOffsetFn()
  const updateElementOffset = debounceFn(updateElementOffsetFn, { wait: 500 })

  const pointerdown = (e: PointerEvent) => {
    e.preventDefault()
    const point = { x: e.pageX - elementOffset.x, y: e.pageY - elementOffset.y }
    if (e.buttons !== 1 || props.onAcceptDown?.(point) === false) return
    firstPointerPosition.set(e.pointerId, point)
  }

  const pointermove = (e: PointerEvent) => {
    const firstPointer = firstPointerPosition.get(e.pointerId)
    const lastPointer = lastPointerPosition.get(e.pointerId) || firstPointer
    if (!lastPointer || !firstPointer) return
    e.preventDefault()
    const point = { x: e.pageX - elementOffset.x, y: e.pageY - elementOffset.y }
    lastPointerPosition.set(e.pointerId, point)

    if (firstPointerPosition.size == 1) {
      props.onDrag?.(lastPointer, point, firstPointer)
    } else if (firstPointerPosition.size == 2) {
      const otherId = [...firstPointerPosition.keys()].find((pointerId) => pointerId !== e.pointerId)
      if (!otherId) return
      const secondPointer = lastPointerPosition.get(otherId) || firstPointerPosition.get(otherId)
      if (lastPointer && secondPointer && firstPointer) {
        const oldDistance = distance2(lastPointer.x, lastPointer.y, secondPointer.x, secondPointer.y)
        const oldCenter = {
          x: lastPointer.x / 2 + secondPointer.x / 2,
          y: lastPointer.y / 2 + secondPointer.y / 2,
        }

        const newDistance = distance2(point.x, point.y, secondPointer.x, secondPointer.y)
        const newCenter = {
          x: point.x / 2 + secondPointer.x / 2,
          y: point.y / 2 + secondPointer.y / 2,
        }
        props.onZoomDrag?.({ center: oldCenter, distance: oldDistance }, { center: newCenter, distance: newDistance })
      }
    }
  }

  const pointerclear = (e: PointerEvent) => {
    const pointer = lastPointerPosition.get(e.pointerId)
    const originalPointer = firstPointerPosition.get(e.pointerId)
    if (originalPointer) {
      lastPointerPosition.clear()
      firstPointerPosition.clear()
      if (!pointer) {
        props.onClick?.()
      }
      props.onClear?.()
    }
  }

  const wheel = (e: WheelEvent) => {
    e.preventDefault()
    const x = e.pageX - elementOffset.x
    const y = e.pageY - elementOffset.y
    const factor = -e.deltaY * (e.deltaMode == 2 ? -0.025 : e.deltaMode == 1 ? 0.01 : 0.0005)
    props.onZoom?.({ x, y }, factor)
  }

  const preventDefault = (e: Event) => e.preventDefault()
  const notPassive = {
    passive: false,
  }

  window.addEventListener("resize", updateElementOffset)
  domElement.ownerDocument.addEventListener("gesturestart", preventDefault, notPassive)
  domElement.ownerDocument.addEventListener("gestureend", preventDefault, notPassive)
  domElement.ownerDocument.addEventListener("gesturechange", preventDefault, notPassive)
  domElement.addEventListener("pointerdown", pointerdown, notPassive)
  domElement.addEventListener("touchdown", preventDefault, notPassive)
  domElement.addEventListener("touchmove", preventDefault, notPassive)
  domElement.ownerDocument.addEventListener("pointermove", pointermove, notPassive)
  domElement.ownerDocument.addEventListener("pointerup", pointerclear, notPassive)
  domElement.addEventListener("pointercancel", pointerclear, notPassive)
  domElement.addEventListener("wheel", wheel, notPassive)

  return () => {
    window.removeEventListener("resize", updateElementOffset)
    domElement.ownerDocument.removeEventListener("gesturestart", preventDefault)
    domElement.ownerDocument.removeEventListener("gestureend", preventDefault)
    domElement.ownerDocument.removeEventListener("gesturechange", preventDefault)
    domElement.removeEventListener("pointerdown", pointerdown)
    domElement.removeEventListener("touchdown", preventDefault)
    domElement.removeEventListener("touchmove", preventDefault)
    domElement.ownerDocument.removeEventListener("pointermove", pointermove)
    domElement.ownerDocument.removeEventListener("pointerup", pointerclear)
    domElement.removeEventListener("pointercancel", pointerclear)
    domElement.removeEventListener("wheel", wheel)
  }
}

import { useEffect, useRef } from "react"
import useCameraStore from "../store/useCameraStore"

export const TiltControl = () => {
  const cameraStore = useCameraStore()
  const ref = useRef<HTMLDivElement>(null)
  const downAt = useRef<PointerEvent | undefined>(undefined)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const pointerdown = (e: PointerEvent) => {
      downAt.current = e
      e.preventDefault()
    }
    const pointermove = (e: PointerEvent) => {
      if (e.pointerId == downAt.current?.pointerId) {
        e.preventDefault()
        const delta = ((e.clientY - downAt.current.clientY) / window.innerHeight) * 3
        cameraStore.modifyPosition(delta)
        downAt.current = e
      }
    }
    const pointerup = () => {
      downAt.current = undefined
    }
    const cancelHandler = (e: TouchEvent) => e.preventDefault()
    el.addEventListener("pointerdown", pointerdown, { passive: false })
    el.ownerDocument.addEventListener("pointermove", pointermove, {
      passive: false,
    })
    el.ownerDocument.addEventListener("pointerup", pointerup, {
      passive: false,
    })
    el.ownerDocument.addEventListener("pointercancel", pointerup, {
      passive: false,
    })
    el.addEventListener("touchstart", cancelHandler, { passive: false })
    el.addEventListener("touchmove", cancelHandler, { passive: false })

    return () => {
      el.removeEventListener("pointerdown", pointerdown)
      el.ownerDocument.removeEventListener("pointermove", pointerdown)
      el.ownerDocument.removeEventListener("pointerup", pointerup)
      el.ownerDocument.removeEventListener("pointercancel", pointerup)
      el.removeEventListener("touchstart", cancelHandler)
      el.removeEventListener("touchmove", cancelHandler)
    }
  }, [])

  return (
    <div ref={ref} touch-action="none">
      <svg viewBox="-11 -11 22 22 ">
        <circle r={10} cx={0} cy={0} fill="none" stroke="#000" />
        <ellipse
          rx={10}
          ry={cameraStore.camPosition * 8.99 + ((1 - cameraStore.camPosition) * cameraStore.camY) / 20 + 1.501}
          cx={0}
          cy={0}
          fill="#8888"
          stroke="#000"
        />
        <ellipse rx={Math.abs(cameraStore.camX / 5) + 0.001} ry={10} cx={0} cy={0} fill="#8888" stroke="#000" />
      </svg>
    </div>
  )
}

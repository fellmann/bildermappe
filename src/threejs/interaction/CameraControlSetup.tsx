import debounce from "debounce-fn"
import { useThree } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import { Vector3 } from "three"
import useCameraStore from "../../store/useCameraStore"
import useChoreoStore from "../../store/useChoreoStore"
import cursorToWorld from "../helpers/cursorToWorld"
import shallow from "zustand/shallow"
import PointerController from "./PointerController"
import useSettingsStore from "../../store/useSettingsStore"

export function CameraControlSetup() {
  const { gl, invalidate, clock, camera } = useThree(
    (s) => ({
      gl: s.gl,
      invalidate: s.invalidate,
      clock: s.clock,
      camera: s.camera,
    }),
    shallow
  )
  const cameraStore = useRef(useCameraStore.getState())

  useEffect(() => {
    useChoreoStore.getState().setTimeProvider(() => clock.getElapsedTime())

    useCameraStore.setState({ camera })

    return useCameraStore.subscribe((cameraState) => {
      cameraStore.current = cameraState
      camera.position.set(...cameraState.getCameraPosition())
      camera.zoom = cameraState.zoom * 1 * cameraState.zoomFactor
      camera.updateProjectionMatrix()
      camera.up.set(0, 0, 1)
      camera.lookAt(cameraState.camX, cameraState.camY, 0)
      camera.updateMatrixWorld()
      invalidate()
    })
  }, [camera])

  useEffect(() => {
    cameraStore.current.modifyZoomFactor(1)
    let p = new Vector3(-10, -10, 0).project(camera)
    const maxX = Math.min(1200, gl.domElement.clientWidth) / gl.domElement.clientWidth
    let zoomFactor = Math.min(Math.abs(maxX / p.x), Math.abs(1 / p.y)) * 0.95
    cameraStore.current.modifyZoomFactor(zoomFactor)
  }, [camera])

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName?.toUpperCase() === "INPUT") return
      if (e.key == "ArrowLeft") useChoreoStore.getState().prevImage()
      else if (e.key == "ArrowRight") useChoreoStore.getState().nextImage()
      else if (e.key == "a" && e.ctrlKey) useChoreoStore.getState().selectAll(-100000, -100000, 100000, 100000)
      else if (e.key == "z" && e.ctrlKey) useChoreoStore.getState().undo()
      else if (e.key == "y" && e.ctrlKey) useChoreoStore.getState().redo()
    }
    window.addEventListener("keydown", keydown)
    return () => window.removeEventListener("keydown", keydown)
  }, [])

  useEffect(() => {
    const vec1 = new Vector3()
    const vec2 = new Vector3()

    return PointerController(gl.domElement, {
      onAcceptDown: () => useChoreoStore.getState().isAnimationFinished(),
      onDrag: (from, to, origin) => {
        const state = useChoreoStore.getState()
        if (state.downOnPosition) {
          const current = cursorToWorld(to.x, to.y, gl.domElement, camera!!, vec1, state.downOnPosition.z)
          state.dragTo(current.x, current.y)
        } else if (state.downOnPlane) {
          if (useSettingsStore.getState().selectAll) {
            const oldProjected = cursorToWorld(from.x, from.y, gl.domElement, camera, vec1)
            const newProjected = cursorToWorld(origin.x, origin.y, gl.domElement, camera, vec2)

            state.selectAll(
              Math.min(oldProjected.x, newProjected.x),
              Math.min(oldProjected.y, newProjected.y),
              Math.max(oldProjected.x, newProjected.x),
              Math.max(oldProjected.y, newProjected.y)
            )
          } else {
            const oldProjected = cursorToWorld(from.x, from.y, gl.domElement, camera, vec1)
            const newProjected = cursorToWorld(to.x, to.y, gl.domElement, camera, vec2)
            cameraStore.current.modifyOffset(oldProjected.x - newProjected.x, oldProjected.y - newProjected.y)
          }
        } else {
          const diff = ((to.y - from.y) / gl.domElement.clientHeight) * 2
          cameraStore.current.modifyPosition(diff)
        }
      },
      onZoomDrag: (from, to) => {
        const oldProjectedCenter = cursorToWorld(from.center.x, from.center.y, gl.domElement, camera, vec1)
        if (from.distance > 0) cameraStore.current.modifyZoom(to.distance / from.distance)
        const newProjectedCenter = cursorToWorld(to.center.x, to.center.y, gl.domElement, camera, vec2)

        cameraStore.current.modifyOffset(
          -(newProjectedCenter.x - oldProjectedCenter.x),
          -(newProjectedCenter.y - oldProjectedCenter.y)
        )
      },
      onZoom: ({ x, y }, factor) => {
        const oldProjectedCenter = cursorToWorld(x, y, gl.domElement, camera, vec1)
        cameraStore.current.modifyZoom(1 + factor)
        const newProjectedCenter = cursorToWorld(x, y, gl.domElement, camera, vec2)
        cameraStore.current.modifyOffset(
          -(newProjectedCenter.x - oldProjectedCenter.x),
          -(newProjectedCenter.y - oldProjectedCenter.y)
        )
      },
      onClear: () => {
        useChoreoStore.getState().onPointerUp()
        invalidate()
      },
      onClick: () => {
        if (!useChoreoStore.getState().downOnPosition) useChoreoStore.getState().unselect()
      },
    })
  }, [])

  return null
}

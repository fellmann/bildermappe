import { Choreography } from "./useChoreoStore"

export const exportChoreo = async (choreo: Choreography) => {
  const blob = new Blob([JSON.stringify(choreo)], { type: "text/plain" })
  saveFile(blob, choreo.name.replaceAll(/[^a-zA-Z0-9]/g, "") + ".txt")
}

function saveFile(blob: Blob, filename: string) {
  const a = document.createElement("a")
  document.body.appendChild(a)
  const url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => {
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }, 0)
}

export const importChoreo = async (files: FileList | null) => {
  try {
    if (files?.length) {
      const file = files.item(0)
      if (!file) return
      const text = await file.text()
      const choreo = JSON.parse(text || "{}") as Choreography
      if (choreo?.floor && choreo.images?.length && choreo.persons > 0) {
        return choreo
      }
    }
  } catch (e) {
    alert("Fehler beim Laden!")
  }
}

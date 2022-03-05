import { Choreography, Image } from "./useChoreoStore"

interface ChoreomasterFile {
  Floor?: {
    SizeFront: number
    SizeBack: number
    SizeLeft: number
    SizeRight: number
  }
  Roles?: {
    $id: string
    Name: string
  }[]
  Dancers?: {
    $id: string
    Role: {
      $ref: string
    }
    Name: string
    Shortcut: string
  }[]
  Scenes?: {
    Positions: {
      Dancer: {
        $ref: string
      }
      X: number
      Y: number
    }[]
    Name: string
    Text: string
    FixedPositions: boolean
  }[]
  Name: string
  Date: string
  LastSaveDate: string
}

export const importChoreo = async (files: FileList | null) => {
  try {
    if (files?.length) {
      const file = files.item(0)
      if (!file) return
      const text = await file.text()
      const raw = JSON.parse(text || "{}")
      const choreo = raw as Choreography
      if (choreo?.floor && choreo.images?.length && choreo.persons > 0) {
        return choreo
      }

      return importChoreomasterFile(raw)
    }
  } catch (e) {
    alert("Fehler beim Laden!")
  }
}


function importChoreomasterFile(data: ChoreomasterFile): Choreography | undefined {
  if (!data.Scenes?.length || !data.Dancers?.length || !data.Roles?.length || !data.Floor) return

  const persons = data.Dancers.filter((i) => i.Role.$ref === "1").length

  const idxMap: Record<string, number> = {}

  let idxMale = 0,
    idxFemale = 0
  data.Dancers.forEach((d) => {
    if (d.Role.$ref === "1") {
      idxMap[d.$id] = idxFemale * 2 + 1
      idxFemale++
    } else {
      idxMap[d.$id] = idxMale * 2
      idxMale++
    }
  })

  const images: Image[] = data.Scenes.map((scene) => {
    const positions: [number, number][] = []

    scene.Positions.forEach(
      (position) =>
        (positions[idxMap[position.Dancer.$ref] ?? 0] = [Math.round(position.X * 100), Math.round(position.Y * 100)])
    )

    return { disabled: false, name: scene.Name, positions }
  })

  return {
    created: new Date(data.Date).getTime(),
    lastModified: new Date(data.LastSaveDate).getTime(),
    floor: {
      width: Math.max(data.Floor.SizeLeft, data.Floor.SizeRight) * 2,
      height: Math.max(data.Floor.SizeFront, data.Floor.SizeBack) * 2,
    },
    name: data.Name,
    persons,
    images,
  }
}

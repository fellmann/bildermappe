import debounce from "debounce-fn"
import create, { GetState, SetState } from "zustand"
import { StoreApiWithSubscribeWithSelector, subscribeWithSelector } from "zustand/middleware"

type SelectionModeType = "male" | "female" | "both"
type GridSize = 50 | 10

interface SettingsStoreType {
  selectionMode: SelectionModeType
  setSelectionMode(mode: SelectionModeType): void

  selectAll: boolean
  toggleSelectAll(): void

  locked: boolean
  toggleLocked(): void

  gridSize: GridSize
  setGridSize(gridSize: GridSize): void
}

const useSettingsStore = create(
  subscribeWithSelector<
    SettingsStoreType,
    SetState<SettingsStoreType>,
    GetState<SettingsStoreType>,
    StoreApiWithSubscribeWithSelector<SettingsStoreType>
  >((set, get) => ({
    selectionMode: "both",
    setSelectionMode: (mode) => set(() => ({ selectionMode: mode })),

    selectAll: false,
    toggleSelectAll: () => set((state) => ({ selectAll: !state.selectAll })),

    locked: false,
    toggleLocked: () => set((s) => ({ locked: !s.locked })),

    gridSize: 50,
    setGridSize(gridSize) {
      set(() => ({ gridSize }))
    },
  }))
)

try {
  const existingData = JSON.parse(localStorage.getItem("settingsStore") || "{}")
  if (existingData) {
    useSettingsStore.setState(existingData)
  }
} catch (e) {
  // ignore
}

useSettingsStore.subscribe(
  debounce(
    (settings) => {
      localStorage.setItem("settingsStore", JSON.stringify(settings))
    },
    { wait: 1000 }
  )
)

export default useSettingsStore

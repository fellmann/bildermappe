import create, { GetState, SetState } from "zustand"
import { StoreApiWithSubscribeWithSelector, subscribeWithSelector } from "zustand/middleware"
import useChoreoStore, { Choreography, findLocalChoreos } from "./useChoreoStore"

interface InputType {
  message: string
  defaultValue: string
  close: (input?: string) => void
}
interface AlertType {
  message: string
  close: () => void
}
interface ConfirmType {
  message: string
  close: (result?: boolean) => void
}

interface ViewStoreType {
  alert?: AlertType
  showAlert: (message: string) => Promise<void>

  input?: InputType
  showInput: (message: string, defaultValue: string) => Promise<string | undefined>

  confirm?: ConfirmType
  showConfirm: (message: string) => Promise<boolean | undefined>

  loadChoreo?: Choreography[]
  closeLoadChoreo: () => void
  showLoadChoreo: () => void
}

const useViewStore = create(
  subscribeWithSelector<
    ViewStoreType,
    SetState<ViewStoreType>,
    GetState<ViewStoreType>,
    StoreApiWithSubscribeWithSelector<ViewStoreType>
  >((set, get) => ({
    showAlert(message) {
      return new Promise((res) => {
        set(() => ({
          alert: {
            message,
            close: () => {
              set(() => ({ alert: undefined }))
              res()
            },
          },
        }))
      })
    },
    showConfirm(message) {
      return new Promise((res) => {
        set(() => ({
          confirm: {
            message,
            close: (value) => {
              set(() => ({ confirm: undefined }))
              res(value)
            },
          },
        }))
      })
    },
    showInput(message, defaultValue) {
      return new Promise((res) => {
        set(() => ({
          input: {
            message,
            defaultValue,
            close: (value) => {
              set(() => ({ input: undefined }))
              res(value)
            },
          },
        }))
      })
    },
    closeLoadChoreo: () => set(() => ({ loadChoreo: undefined })),
    showLoadChoreo: () =>
      set(() => ({
        loadChoreo: findLocalChoreos(),
      })),
  }))
)

export default useViewStore

import useViewStore from "./store/useViewStore"

const notifyUpdate = () =>
  useViewStore
    .getState()
    .showAlert(
      "Eine neue Version ist verfügbar! Bitte schließe alle geöffneten Versionen und starte die App neu, um die neue Version zu verwenden."
    )

export async function initServiceWorker() {
  if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
    window.addEventListener("load", async () => {
      const registration = await navigator.serviceWorker.register(new URL("serviceworker.js", import.meta.url), {
        type: "module",
      })
      if (registration.waiting && registration.active) {
        notifyUpdate()
      } else {
        registration.addEventListener("updatefound", () => {
          registration.installing?.addEventListener("statechange", (event) => {
            if ((event.target as ServiceWorker)?.state === "installed" && registration.active) {
              notifyUpdate()
            }
          })
        })
      }
    })
  }
}

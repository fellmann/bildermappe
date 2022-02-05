import { render } from "react-dom"
import App from "./App"
import { initServiceWorker } from "./initServiceWorker"
import { initPolyfills } from "./initPolyfills"

async function initAndRender() {
  await initPolyfills()

  render(<App />, document.getElementById("main"))

  await initServiceWorker()
}

initAndRender()

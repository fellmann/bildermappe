import CircularProgress from "@mui/material/CircularProgress"
import CssBaseline from "@mui/material/CssBaseline"
import { lazy, Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import "./App.scss"
import { ErrorFallback } from "./ui/components/ErrorFallback"
import { UI } from "./ui/UI"

const FloorSetup = lazy(() => import("./threejs/FloorSetup"))

function Loading() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </div>
  )
}

export default function () {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        location.reload()
      }}
    >
      <UI>
        <CssBaseline />
        <Suspense fallback={<Loading />}>
          <FloorSetup />
        </Suspense>
      </UI>
    </ErrorBoundary>
  )
}

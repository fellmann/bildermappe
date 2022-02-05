import MenuIcon from "@mui/icons-material/Menu"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import useMediaQuery from "@mui/material/useMediaQuery"
import { FunctionComponent, useState } from "react"
import { AlertDialog } from "./components/AlertDialog"
import { ConfirmDialog } from "./components/ConfirmDialog"
import { InputDialog } from "./components/InputDialog"
import { LoadChoreoDialog } from "./components/LoadChoreoDialog"
import AppBar from "./drawer/AppBar"
import { ImageList } from "./drawer/ImageList"
import { TiltControl } from "./TiltControl"
import { ToolbarControl } from "./ToolbarControl"

export const UI: FunctionComponent = ({ children }) => {
  const matches = useMediaQuery("(min-width:900px)")
  const [drawer, setDrawer] = useState(false)

  return (
    <>
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
        }}
      >
        {matches && (
          <Paper
            elevation={3}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: "200px",
              height: "100%",
            }}
          >
            <AppBar />
            <ImageList />
          </Paper>
        )}
        {!matches && (
          <Drawer anchor="left" open={drawer} onClose={() => setDrawer(false)}>
            <div
              style={{
                maxHeight: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <AppBar />
              <ImageList />
            </div>
          </Drawer>
        )}
        <div style={{ flex: 4, position: "relative", flexBasis: 0, minWidth: 0 }}>
          {children}
          {/* <OverlayView /> */}
          {!matches && (
            <div style={{ position: "absolute", top: "10px", left: "10px" }}>
              <IconButton onClick={() => setDrawer(true)}>
                <MenuIcon />
              </IconButton>
            </div>
          )}
          <div
            style={{
              position: "absolute",
              width: "40px",
              right: 0,
              top: "50%",
            }}
          >
            <TiltControl />
          </div>
          <div style={{ position: "absolute", right: 0, bottom: 0 }}>
            <ToolbarControl />
          </div>
        </div>
        <LoadChoreoDialog />
        <AlertDialog />
        <ConfirmDialog />
        <InputDialog />
      </div>
    </>
  )
}

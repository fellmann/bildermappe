import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import Check from "@mui/icons-material/Check"
import FullScreenIcon from "@mui/icons-material/Fullscreen"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import CheckIcon from "@mui/icons-material/Check"
import PeopleIcon from "@mui/icons-material/People"
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline"
import PersonIcon from "@mui/icons-material/Person"
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"
import RedoIcon from "@mui/icons-material/Redo"
import UndoIcon from "@mui/icons-material/Undo"
import ReplayIcon from "@mui/icons-material/Replay"
import Checkbox from "@mui/material/Checkbox"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { useState } from "react"
import shallow from "zustand/shallow"
import useChoreoStore from "../store/useChoreoStore"
import useSettingsStore from "../store/useSettingsStore"
import SelectAllIcon from "@mui/icons-material/SelectAll"
import CheckMenu from "./components/CheckMenu"
import useCameraStore from "../store/useCameraStore"

export const ToolbarControl = () => {
  const choreoStore = useChoreoStore(
    (s) => ({
      imageCount: s.choreo.images.length,
      currentImage: s.currentImage,
      prevImage: s.prevImage,
      nextImage: s.nextImage,
      reanimateImage: s.reanimateImage,
      undo: s.undo,
      redo: s.redo,
      canUndo: s.canUndo(),
      canRedo: s.canRedo(),
    }),
    shallow
  )
  const settingsStore = useSettingsStore()
  const cameraStore = useCameraStore((s) => ({ backView: s.backView, toggleBackView: s.toggleBackView }))
  const [showMenu, setShowMenu] = useState<{ x: number; y: number } | undefined>(undefined)

  const handleClose = () => setShowMenu(undefined)

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        userSelect: "none",
        fontSize: "18px",
      }}
    >
      <IconButton onClick={choreoStore.reanimateImage}>
        <ReplayIcon />
      </IconButton>
      <IconButton onClick={choreoStore.prevImage}>
        <ArrowBackIcon />
      </IconButton>
      <span
        style={{
          pointerEvents: "none",
        }}
      >
        {choreoStore.currentImage + 1}&nbsp;/&nbsp;{choreoStore.imageCount}
      </span>
      <IconButton onClick={choreoStore.nextImage}>
        <ArrowForwardIcon />
      </IconButton>
      <IconButton onClick={choreoStore.undo} disabled={!choreoStore.canUndo}>
        <UndoIcon />
      </IconButton>
      <IconButton onClick={choreoStore.redo} disabled={!choreoStore.canRedo}>
        <RedoIcon />
      </IconButton>

      <IconButton onClick={(e) => setShowMenu({ x: e.pageX, y: e.pageY })}>
        <MoreVertIcon />
      </IconButton>

      {!!showMenu && (
        <Menu
          open={true}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={{ left: showMenu.x, top: showMenu.y }}
        >
          <MenuItem
            onClick={() => {
              settingsStore.setSelectionMode("female")
            }}
          >
            <ListItemIcon>
              {settingsStore.selectionMode == "female" ? (
                <PersonIcon htmlColor="#a00" />
              ) : (
                <PersonOutlineIcon htmlColor="#800" />
              )}
            </ListItemIcon>
            Damen
          </MenuItem>
          <MenuItem
            onClick={() => {
              settingsStore.setSelectionMode("both")
            }}
          >
            <ListItemIcon>
              {settingsStore.selectionMode == "both" ? (
                <PeopleIcon htmlColor="#a0a" />
              ) : (
                <PeopleOutlineIcon htmlColor="#808" />
              )}
            </ListItemIcon>
            Gemeinsam
          </MenuItem>
          <MenuItem
            onClick={() => {
              settingsStore.setSelectionMode("male")
            }}
          >
            <ListItemIcon>
              {settingsStore.selectionMode == "male" ? (
                <PersonIcon htmlColor="#00a" />
              ) : (
                <PersonOutlineIcon htmlColor="#008" />
              )}
            </ListItemIcon>
            Herren
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              settingsStore.setGridSize(10)
            }}
          >
            {settingsStore.gridSize == 10 && (
              <ListItemIcon>
                <CheckIcon />
              </ListItemIcon>
            )}
            <ListItemText inset={settingsStore.gridSize != 10}>Raster 10 cm</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              settingsStore.setGridSize(50)
            }}
          >
            {settingsStore.gridSize == 50 && (
              <ListItemIcon>
                <CheckIcon />
              </ListItemIcon>
            )}
            <ListItemText inset={settingsStore.gridSize != 50}>Raster 50 cm</ListItemText>
          </MenuItem>
          <Divider />
          <CheckMenu checked={settingsStore.locked} onClick={settingsStore.toggleLocked}>
            Bearbeiten sperren
          </CheckMenu>
          <CheckMenu checked={settingsStore.selectAll} onClick={settingsStore.toggleSelectAll}>
            Auswahlrahmen
          </CheckMenu>
          <CheckMenu
            onClick={() => {
              cameraStore.toggleBackView()
            }}
            checked={cameraStore.backView}
          >
            Blick von hinten
          </CheckMenu>
          <MenuItem
            onClick={() => {
              handleClose()
              document.body.requestFullscreen()
            }}
          >
            <ListItemIcon>
              <FullScreenIcon />
            </ListItemIcon>
            Vollbild
          </MenuItem>
        </Menu>
      )}
    </div>
  )
}

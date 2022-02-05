import CheckIcon from "@mui/icons-material/Check"
import Divider from "@mui/material/Divider"
import ListItemIcon from "@mui/material/ListItemIcon"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import deepEqual from "fast-deep-equal"
import useChoreoStore from "../../store/useChoreoStore"
import useViewStore from "../../store/useViewStore"

export function ImageListContextMenu(contextMenu: {
  id: number
  handleClose: () => void
  mouseY: number
  mouseX: number
}) {
  const choreoStore = useChoreoStore(
    (s) => ({
      removeImage: s.removeImage,
      toggleImageEnabled: s.toggleImageEnabled,
      moveImage: s.moveImage,
      setImageName: s.setImageName,
      image: s.choreo.images[contextMenu.id],
    }),
    deepEqual
  )
  const showInput = useViewStore((s) => s.showInput)

  return (
    <Menu
      open={contextMenu !== null}
      onClose={contextMenu.handleClose}
      anchorReference="anchorPosition"
      anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
    >
      <MenuItem disabled={true}>{contextMenu ? "Bild " + (contextMenu.id + 1) : "-"}</MenuItem>
      <MenuItem
        onClick={async () => {
          contextMenu.handleClose()
          const newName = await showInput("Name des Bildes", choreoStore.image?.name || "")
          if (newName !== undefined) {
            choreoStore.setImageName(contextMenu.id, newName)
          }
        }}
      >
        Umbenennen...
      </MenuItem>
      <MenuItem
        onClick={() => {
          choreoStore.moveImage(contextMenu.id, contextMenu.id - 1)
          contextMenu.handleClose()
        }}
      >
        Nach oben
      </MenuItem>
      <MenuItem
        onClick={() => {
          choreoStore.moveImage(contextMenu.id, contextMenu.id + 1)
          contextMenu.handleClose()
        }}
      >
        Nach unten
      </MenuItem>
      <MenuItem
        onClick={() => {
          choreoStore.removeImage(contextMenu.id)
          contextMenu.handleClose()
        }}
      >
        Entfernen
      </MenuItem>
      <Divider />

      <MenuItem
        onClick={() => {
          choreoStore.toggleImageEnabled(contextMenu.id)
          contextMenu.handleClose()
        }}
      >
        {!!choreoStore.image?.disabled && (
          <ListItemIcon>
            <CheckIcon />
          </ListItemIcon>
        )}
        Ausblenden
      </MenuItem>
    </Menu>
  )
}

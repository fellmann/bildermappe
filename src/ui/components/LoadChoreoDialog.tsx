import dayjs from "dayjs"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import DialogContentText from "@mui/material/DialogContentText"
import TextField from "@mui/material/TextField"
import { useRef } from "react"
import useViewStore from "../../store/useViewStore"
import { ImageListIconSvgPositions } from "../drawer/ImageListIconSvg"
import useChoreoStore, { calculatePositions } from "../../store/useChoreoStore"

export function LoadChoreoDialog() {
  const { loadChoreo, toggle: close } = useViewStore((s) => ({ loadChoreo: s.loadChoreo, toggle: s.closeLoadChoreo }))

  if (!loadChoreo?.length) return null
  return (
    <Dialog open={true} onClose={close}>
      <DialogContent>
        <DialogTitle>Bildermappe öffnen</DialogTitle>
        <List disablePadding>
          {loadChoreo.map((c) => {
            const changetext = dayjs(c.lastModified).format("DD.MM.YY HH:mm")
            return (
              <ListItem disablePadding key={c.name}>
                <ListItemButton
                  onClick={() => {
                    useChoreoStore.getState().setChoreo(c)
                    close()
                  }}
                >
                  <ImageListIconSvgPositions
                    persons={c.persons}
                    positions={calculatePositions(c.images[0]?.positions || [], c.persons)}
                    floor={c.floor}
                  />
                  <ListItemText primary={c.name} secondary={changetext} />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="secondary">
          Abbrechen
        </Button>
      </DialogActions>
    </Dialog>
  )
}

import MenuIcon from "@mui/icons-material/Menu"
import AppBar from "@mui/material/AppBar"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Toolbar from "@mui/material/Toolbar"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
import { useRef, useState } from "react"
import { exportChoreo, importChoreo } from "../../store/ChoreoExporter"
import useChoreoStore from "../../store/useChoreoStore"
import useViewStore from "../../store/useViewStore"
export default function DefaultAppBar() {
  const [contextMenu, setContextMenu] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const handleClose = () => setContextMenu(false)
  const handleOpen = () => setContextMenu(true)
  const name = useChoreoStore((s) => s.choreo.name)

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton ref={ref} onClick={handleOpen} size="large" edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            {name}
          </Typography>
        </Toolbar>
      </AppBar>
      <input
        type="file"
        style={{ display: "none" }}
        ref={input}
        onChange={async (e) => {
          const files = e.currentTarget.files
          if (files) {
            const choreo = await importChoreo(files)
            if (choreo) {
              const newName = await inputChoreoName(choreo.name)
              if (newName) useChoreoStore.getState().setChoreo({ ...choreo, name: newName })
            }
          }
          if (input.current) input.current.value = ""
        }}
      />
      <Menu open={contextMenu} onClose={handleClose} anchorReference="anchorEl" anchorEl={ref.current}>
        <MenuItem
          onClick={async () => {
            const name = await inputChoreoName("Neue Bildermappe")
            if (name) useChoreoStore.getState().setChoreo({ name })
            handleClose()
          }}
        >
          Neu ...
        </MenuItem>
        <MenuItem
          onClick={() => {
            useViewStore.getState().showLoadChoreo()
            handleClose()
          }}
        >
          Öffnen ...
        </MenuItem>
        <MenuItem disabled>Automatisch gespeichert</MenuItem>
        <MenuItem
          onClick={async () => {
            const newName = await inputChoreoName(name)
            if (newName) useChoreoStore.getState().setChoreoName(newName)
            handleClose()
          }}
        >
          Speichern unter ...
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            input.current?.click()
            handleClose()
          }}
        >
          Importieren ...
        </MenuItem>
        <MenuItem
          onClick={() => {
            const store = useChoreoStore.getState()
            handleClose()
            exportChoreo(store.choreo)
          }}
        >
          Exportieren ...
        </MenuItem>
        <Divider />
        <MenuItem component={"a"} href="https://github.com/fellmann/bildermappe" target="_blank">
          Über ...
        </MenuItem>
      </Menu>
    </>
  )
}

async function inputChoreoName(defaultName: string) {
  let name = ""
  while (!name) {
    const input = await useViewStore.getState().showInput("Name der Bildermappe", defaultName)
    if (!input) return
    if (localStorage.getItem("choreo-" + input)) {
      if (await useViewStore.getState().showConfirm(input + " existiert schon. Überschreiben?")) {
        name = input
      }
    } else {
      name = input
    }
  }
  return name
}

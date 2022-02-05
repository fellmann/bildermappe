import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import TextField from "@mui/material/TextField"
import { useRef } from "react"
import useViewStore from "../../store/useViewStore"

export function InputDialog() {
  const input = useViewStore((s) => s.input)
  const inputRef = useRef<HTMLInputElement>()

  if (!input) return null
  return (
    <Dialog open={true} onClose={() => input.close()}>
      <DialogContent>
        <DialogContentText>{input.message}</DialogContentText>
        <TextField
          defaultValue={input.defaultValue}
          inputRef={(e) => {
            inputRef.current = e
            inputRef.current?.focus()
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => input.close(inputRef.current?.value)}>OK</Button>
      </DialogActions>
    </Dialog>
  )
}

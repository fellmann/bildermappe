import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogActions from "@mui/material/DialogActions"
import useViewStore from "../../store/useViewStore"

export function AlertDialog() {
  const alert = useViewStore((s) => s.alert)

  if (!alert) return null
  return (
    <Dialog open={true} onClose={alert.close}>
      <DialogContent>
        <DialogContentText>{alert.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={alert.close}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

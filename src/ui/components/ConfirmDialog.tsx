import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogActions from "@mui/material/DialogActions"
import useViewStore from "../../store/useViewStore"

export function ConfirmDialog() {
  const confirm = useViewStore((s) => s.confirm)

  if (!confirm) return null
  return (
    <Dialog open={true} onClose={() => confirm.close(false)}>
      <DialogContent>
        <DialogContentText>{confirm.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" autoFocus onClick={() => confirm.close(false)}>
          Nein
        </Button>
        <Button color="primary" autoFocus onClick={() => confirm.close(true)}>
          Ja
        </Button>
      </DialogActions>
    </Dialog>
  )
}

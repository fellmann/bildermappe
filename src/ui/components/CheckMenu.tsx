import CheckIcon from "@mui/icons-material/Check"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import MenuItem from "@mui/material/MenuItem"

export default function (props: React.PropsWithChildren<{ onClick: () => void; checked: boolean }>) {
  return (
    <MenuItem onClick={props.onClick}>
      {props.checked && (
        <ListItemIcon>
          <CheckIcon />
        </ListItemIcon>
      )}
      <ListItemText inset={!props.checked}>{props.children}</ListItemText>
    </MenuItem>
  )
}

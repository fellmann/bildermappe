import MenuIcon from "@mui/icons-material/MoreVert"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { useCallback } from "react"
import { ListChildComponentProps } from "react-window"
import shallow from "zustand/shallow"
import useChoreoStore from "../../store/useChoreoStore"
import { ImageListIconSvg } from "./ImageListIconSvg"

export const ImageListItem = (
  props: ListChildComponentProps<{
    handleContextMenu: (e: React.MouseEvent, idx: number) => void
  }>
) => {
  const { setImage, currentImage, imageDisabled, imageName } = useChoreoStore(
    useCallback(
      (s) => ({
        currentImage: s.currentImage,
        imageDisabled: s.choreo.images[props.index]?.disabled,
        imageName: s.choreo.images[props.index]?.name,
        setImage: s.setImage,
      }),
      [props.index]
    ),
    shallow
  )

  const text = !!imageName && imageName.length > 20 ? imageName.substring(0, 30) + "..." : imageName

  const onContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      props.data.handleContextMenu(e, props.index)
    },
    [props.index]
  )

  return (
    <ListItem
      disabled={!!imageDisabled}
      disableGutters={true}
      disablePadding={true}
      style={{ ...props.style, overflow: "hidden" }}
      secondaryAction={
        <IconButton onClick={onContextMenu}>
          <MenuIcon />
        </IconButton>
      }
    >
      <ListItemButton
        selected={props.index == currentImage}
        onContextMenu={(e) => {
          e.stopPropagation()
          e.preventDefault()
          props.data.handleContextMenu(e, props.index)
        }}
        onClick={(e) => setImage(props.index)}
      >
        <ListItemIcon>
          <ImageListIconSvg index={props.index} />
        </ListItemIcon>
        <ListItemText primary={"Bild " + (props.index + 1)} secondary={text || undefined} />
      </ListItemButton>
    </ListItem>
  )
}

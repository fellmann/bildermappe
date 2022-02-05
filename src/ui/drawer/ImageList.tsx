import CreateIcon from "@mui/icons-material/Add"
import Fab from "@mui/material/Fab"
import deepEqual from "fast-deep-equal"
import { useState } from "react"
import AutoSizer, { Size } from "react-virtualized-auto-sizer"
import { FixedSizeList } from "react-window"
import useChoreoStore from "../../store/useChoreoStore"
import { ImageListContextMenu } from "./ImageListContextMenu"
import { ImageListItem } from "./ImageListItem"

export const ImageList = () => {
  const choreoStore = useChoreoStore(
    (choreoStore) => ({
      imageCount: choreoStore.choreo.images.length,
      addImage: choreoStore.addImage,
      removeImage: choreoStore.removeImage,
      moveImage: choreoStore.moveImage,
    }),
    deepEqual
  )
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number
    mouseY: number
    id: number
  } | null>(null)

  const handleContextMenu = (event: React.MouseEvent, id: number) => {
    event.preventDefault()
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            id,
          }
        : null
    )
  }

  const handleClose = () => {
    setContextMenu(null)
  }

  return (
    <div style={{ flex: 1 }}>
      <AutoSizer>
        {({ height, width }: Size) => (
          <FixedSizeList
            width={width}
            height={height}
            itemSize={64}
            itemCount={choreoStore.imageCount}
            itemData={{ handleContextMenu, handleClose }}
          >
            {ImageListItem}
          </FixedSizeList>
        )}
      </AutoSizer>
      {contextMenu && <ImageListContextMenu {...contextMenu} handleClose={handleClose} />}
      <Fab
        size="medium"
        onClick={() => choreoStore.addImage()}
        color="primary"
        style={{ position: "absolute", bottom: 10, right: 10 }}
      >
        <CreateIcon />
      </Fab>
    </div>
  )
}

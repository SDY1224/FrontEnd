import _ from 'lodash'
import React from 'react'
import { connectWithRedux } from '_redux/instructor'
import { Button } from 'pico-ui'
import { mediaControl, setup } from '../../Utils'

function ButtonBar({
  results=[],
  isSelectingVideos=false,
  selectedVideos=[],
}) {

  const handleSelectAll = () => {
    mediaControl.selectAll(results)
  }

  const handleDeleteVideos = () => {
    setup.confirm({
      text: <>Are you sure to delete the selected videos?</>,
      onConfirm: () => mediaControl.handleDeleteVideos()
    })
  }

  const handleOpenSelect = () => {
    mediaControl.openSelect()
  }

  const handleCancelSelect = () => {
    mediaControl.closeSelect()
  }

  const selectedAll = mediaControl.isSelectedAll(results, selectedVideos)

  return results.length ? (
    <div className="w-100 ip-p-btns mt-3">
      <div className="w-100 ct-btn-group ct-d-r-center-v ip-p-btns-con">
      {
        isSelectingVideos
        ?
        <div className="ct-btn-group ct-d-r-center-v">
          <Button.Group>
            <Button compact
              icon={selectedAll ? "close" : "check"}
              color="yellow"
              text={selectedAll ? "Remove All" : "Select All"}
              onClick={handleSelectAll}
            />
            <Button compact
              //icon="delete"
              color="red transparent"
              text="Delete"
              disabled={mediaControl.selectedVideosLength() === 0}
              onClick={handleDeleteVideos}
            />
            <Button compact
              text="Cancel"
              color="transparent"
              onClick={handleCancelSelect}
            />
          </Button.Group>
        </div>
        :
        <div className="ct-btn-group ct-d-r-center-v">
          <Button uppercase
            text="Select"
            color="transparent teal"
            onClick={handleOpenSelect}
          />
        </div>
      }
      </div>
    </div>
  ) : null
}

export default connectWithRedux(
  ButtonBar,
  ['isSelectingVideos', 'selectedVideos'],
  []
)
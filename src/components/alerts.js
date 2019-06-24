import React from 'react';
import { Alert } from 'react-bootstrap'

export const alertMesgs = {
  default: {
    status: 'success', 
    header: 'Default alert', 
    detail: null
  },
  saved: {
    status: 'success', 
    header: 'Successfully saved! :)', 
    detail: null
  },
  deleted: {
    status: 'success', 
    header: 'Successfully deleted the content :)', 
    detail: null
  },
  uploaded: {
    status: 'success', 
    header: 'Successfully Uploaded!',
    detail: 'We will transcribe the video within 2 days.'
  },
  wrong: {
    status: 'danger', 
    header: 'Ooops, something wrong :( Please try again', 
    detail: null
  },
  wrongType: {
    status: 'danger', 
    header: 'Sorry, you can only upload PNG files.', 
    detail: 'E.g. \'myCat.png\''
  }
}

export function GeneralAlert(props) {
  const mesg = alertMesgs[props.type];
  return (
    <Alert 
      show={props.open} dismissible
      className="general-alert" style={{width: props.width+'%'}}
      variant={mesg.status} onClose={props.onClose} 
    >
      { mesg.header ? <Alert.Heading>{mesg.header}</Alert.Heading> : <></>}
      { mesg.detail ? <p>{mesg.detail}</p>: <></>}
    </Alert>
  )
}
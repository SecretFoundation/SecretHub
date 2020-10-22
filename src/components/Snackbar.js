import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default function SwapSnackbar(props) {
  const severity = props.severity;
  const snackbarOpen = props.snackbarOpen;
  const message = props.message;

  const handleClose = props.snackbarClosed;

  return (
    <div>
      <Snackbar open={snackbarOpen || false} 
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
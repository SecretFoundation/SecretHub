import React from 'react';
import { useBaseStyles } from "../../theme";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

export interface LoadingProps {
  readonly loading: boolean;
}

export function Loading(props: LoadingProps): JSX.Element {
  const { loading } = props;
  const classes = useBaseStyles();
  
  return (
    <div>
    <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

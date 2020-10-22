import React from 'react';
import MuiTypography from "@material-ui/core/Typography";
import { useBaseStyles } from "./styles";
import { useBlockHeight } from "../service";

export function BlockHeight(): JSX.Element {
  const classes = useBaseStyles();
  const { blockHeight } = useBlockHeight();

  return <MuiTypography  variant="h6" className={classes.blockHeight}> Latest Block Height: {blockHeight} </MuiTypography>;
}

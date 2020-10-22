import MuiButton, { ButtonProps } from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import * as React from "react";

// TODO: pick some better styles
const useStyles = makeStyles({
  root: {
    height: "40px",
    width: "100%",
    background: "#ebf5fc",
    border: "none",
    outline: "none",
    borderRadius: "20px",
    padding: "5px 15px",
    fontSize: "20px",
    fontWeight: 500,
    color: "#3d5af1",
    boxShadow: "-2px -2px 6px rgba(255, 255, 255, 1), 2px 2px 6px rgba(0, 0, 0, 0.1)",
    "&:hover": {
      boxShadow: "-2px -2px 6px rgba(255, 255, 255, 1), 2px 2px 6px rgba(0, 0, 0, 0.1)",
      background: "#ebf5fc",
    },
    "&:active": {
      boxShadow: "inset -2px -2px 6px rgba(255, 255, 255, 1), inset 2px 2px 6px rgba(0, 0, 0, 0.1)",
      background: "#ebf5fc",
    },
  },
});

// This is a page body to display when there is an error
export function Button(props: ButtonProps): JSX.Element {
  const classes = useStyles();
  return <MuiButton disableElevation disableFocusRipple disableRipple className={classes.root} {...props} />;
}

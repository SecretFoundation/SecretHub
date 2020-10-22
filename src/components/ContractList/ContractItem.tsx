import Avatar from "@material-ui/core/Avatar";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import WorkIcon from "@material-ui/icons/Work";
import * as React from "react";
import { Link } from "react-router-dom";
import { useAccount, useError, useSdk } from "../../service";

import { useBaseStyles } from "../../theme";

export interface ContractItemProps {
  readonly codeId: number;
  /** Bech32 account address */
  readonly address: string;
  readonly creator: string;
  readonly label: string;
}

export function ContractItem({ address, label }: ContractItemProps): JSX.Element {
  const classes = useBaseStyles();
  const { getClient } = useSdk();


  return (
    <div className={classes.dashboardContainer}>
      <Link className={classes.link} to={`/contract/${address}`}>
        <ListItem className={classes.listCard}>
          <ListItemAvatar>
            <Avatar>
              <WorkIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={label} secondary={address} />
        </ListItem>
      </Link>
    </div>
  );
}

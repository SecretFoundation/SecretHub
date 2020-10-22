import * as React from "react";
import { coins } from "@cosmjs/sdk38";
import MuiTypography from "@material-ui/core/Typography";
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import { printableBalanceOf, printableAmount } from "../../service/helpers";

export interface DashboardProps {
  readonly denom: string;
  readonly tokenBalance?: number;
  readonly stakedBalance?: number;
}

export function Dashboard(props: DashboardProps): JSX.Element {
  const { denom, tokenBalance, stakedBalance } = props;
  
  return (
    <div>
      <MuiTypography variant="h6">
        Dashboard
      </MuiTypography>

      <Grid container spacing={10} justify="space-between">
        <Grid item xs={6}>
          <FormLabel>Total voting power: {stakedBalance && printableAmount(denom, String(stakedBalance | 0))}</FormLabel>
        </Grid>
        <Grid item xs={6}>
          <FormLabel>My voting power: {tokenBalance && printableBalanceOf(denom, coins(tokenBalance | 0, denom))}</FormLabel>
        </Grid>
      </Grid>
    </div>
  );
}

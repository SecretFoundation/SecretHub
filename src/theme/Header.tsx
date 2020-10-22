import { Account } from "@cosmjs/sdk38";
import { AppBar, IconButton, Toolbar } from "@material-ui/core";
import MuiTypography from "@material-ui/core/Typography";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import { ArrowBack } from "@material-ui/icons";
import * as React from "react";
import { Link } from "react-router-dom";
import { useBaseStyles } from "./styles";
import { useEagerConnect, useInactiveListener } from '../service/web3Hooks';
import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { formatEther } from '@ethersproject/units'

import { printableBalance } from "../service/helpers";
import { BlockHeight } from "./BlockHeight";

interface ElevationScrollProps {
  readonly children: any;
}

function ElevationScroll(props: ElevationScrollProps): JSX.Element {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    //   target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export interface HeaderProps {
  readonly account?: Account;
  readonly address?: String;
  children?: React.ReactElement;
  balance?: string;
}

function Web3Account() {
  const { account } = useWeb3React()

  return (
    <>
      <span>Account</span>
      <span role="img" aria-label="robot">
        🤖
      </span>
      <span>
        {account === null
          ? '-'
          : account
          ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
          : ''}
      </span>
    </>
  )
}

// function Balance() {
//   const { account, library, chainId } = useWeb3React()

//   const [balance, setBalance] = React.useState()
//   React.useEffect((): any => {
//     if (!!account && !!library) {
//       let stale = false

//       library
//         .getBalance(account)
//         .then((balance: any) => {
//           if (!stale) {
//             setBalance(balance)
//           }
//         })
//         .catch(() => {
//           if (!stale) {
//             setBalance(null)
//           }
//         })

//       return () => {
//         stale = true
//         setBalance(null)
//       }
//     }
//   }, [account, library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds

//   return (
//     <>
//       <span>Balance</span>
//       <span role="img" aria-label="gold">
//         💰
//       </span>
//       <span>{balance === null ? 'Error' : balance ? `Ξ${formatEther(balance)}` : ''}</span>
//     </>
//   )
// }

// Show the current account or any error message in the header
export function Header({ account, address, children }: HeaderProps, props: any): JSX.Element {
    const balance = account ? printableBalance(account.balance) : (<span>
          (No funds - Go get some{" "}
          <a
            href="https://faucet.secrettestnet.io"
            rel="noopener noreferrer"
            target="_blank"
          >
            from the faucet
          </a>
          )
      </span>);
  const classes = useBaseStyles();

  return (
    <React.Fragment>
      <ElevationScroll {...props}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Link to="/" className={classes.account}>
              <IconButton edge="start" color="inherit">
                <ArrowBack />
              </IconButton>
            </Link>
            <MuiTypography variant="h6">
              {address} - {balance}
            </MuiTypography>
            {/* <BlockHeight/> */}
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
    </React.Fragment>
  );
}

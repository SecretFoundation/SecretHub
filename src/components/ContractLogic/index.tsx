import * as React from "react";
import { useEffect, useState } from "react";
import { coin } from "@cosmjs/sdk38";

import { useAccount, useError, useSdk } from "../../service";
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import { Loading } from "./Loading";
import { useWeb3React } from '@web3-react/core';
import { FormValues } from "../Form";

import tokenContract from "../../contracts/ERC20.json";
import eip20Contract from "../../contracts/EIP20.json";
import multiSigSwapContract from "../../contracts/MultiSigSwapWallet.json";
import getWeb3 from "../../getWeb3";
import "../../App.css";
import { Button } from "../../theme";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import CardHeader from '@material-ui/core/CardHeader';
import { IconButton } from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import Tooltip from '@material-ui/core/Tooltip';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
// import styled, { ThemeProvider } from "styled-components";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
// import theme from "./theme";
import Box from "../../components/Box";
import Snackbar from "../../components/Snackbar";
import { useSnackbar, VariantType } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ConsignForm, CONSIGN_AMOUNT_FIELD } from "./ConsignForm";
import { BidForm, BID_AMOUNT_FIELD } from "./BidForm";
import { WithdrawForm, WITHDRAW_AMOUNT_FIELD } from "./WithdrawForm";
import { useBaseStyles } from "../../theme";

// todo config
const secret20MultisigAddress = 'secret1hx84ff3h4m8yuvey36g9590pw9mm2p55cwqnm6';
const secret20TokenAddress = 'secret1ljptw8mf5wk9n69j2v5vl4w2laqlrgspxykanp';

export interface ContractDetailsProps {
  readonly address: string;
  readonly name?: string;
}

const emptyInfo: State = {
  address: "",
  bidTokenAddress: "",
  bidTokenDecimals: "",
  bidTokenName: "",
  bidTokenSymbol: "",
  sellTokenAddress: "",
  sellTokenDecimals: "",
  sellTokenName: "",
  sellTokenSymbol: "",
  minimumBid: "",
  sellAmount: "",
  status: "",
  description: "",
  bidTokenTotalSupply: "",
  sellTokenTotalSupply: "",
  loading: false
};

type State = { 
  readonly address: string,
  readonly bidTokenAddress: string,
  readonly bidTokenDecimals?: string,
  readonly bidTokenName?: string,
  readonly bidTokenSymbol?: string,
  readonly sellTokenAddress: string,
  readonly sellTokenDecimals?: string,
  readonly sellTokenName?: string,
  readonly sellTokenSymbol?: string,
  readonly minimumBid: string,
  readonly sellAmount: string,
  readonly status?: string,
  readonly description?: string,
  readonly bidTokenTotalSupply: string,
  readonly sellTokenTotalSupply: string,
  readonly loading: boolean
};

function ContractLogic({ address }: ContractDetailsProps): JSX.Element {
  const { getClient } = useSdk();
  const { setError } = useError();
  const { refreshAccount } = useAccount();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useBaseStyles();
  const [value, setValue] = React.useState<State>(emptyInfo);
  const [state, setState] = React.useState<State>(emptyInfo);
  
  // get the contracts
  React.useEffect(() => {
    getClient()
      .getContract(address)
      .then((info: any) => {
          setValue({ ...info, address})
          getClient()
          /* eslint-disable-next-line @typescript-eslint/camelcase */
          .queryContractSmart(address, { auction_info: { } })
          .then((res: any) => {
            const auction = res.auction_info;
            debugger
            setState({ ...state,
              address: address,
              bidTokenAddress: auction.bid_token.contract_address,
              sellTokenAddress: auction.sell_token.contract_address,
              sellTokenDecimals: auction.sell_token.token_info.decimals,
              sellTokenName: auction.sell_token.token_info.name,
              sellTokenSymbol: auction.sell_token.token_info.symbol,
              bidTokenDecimals: auction.bid_token.token_info.decimals,
              bidTokenName: auction.bid_token.token_info.name,
              bidTokenSymbol: auction.bid_token.token_info.symbol,
              bidTokenTotalSupply: auction.bid_token.token_info.total_supply,
              sellTokenTotalSupply: auction.sell_token.token_info.total_supply,
              minimumBid: auction.minimum_bid,
              sellAmount: auction.sell_amount,
              description: auction.description,
              status: auction.status,
              loading: false
            });
          });
        }
      )
      .catch(setError);
  }, [setError, address, getClient]);

  const refreshSecretBalances = async () => {
    setState({ ...state, loading: true });

  }

  function enqueueMessage(message: string, variant?: VariantType): void {
    enqueueSnackbar(message, { variant });
  }

  const doConsign = async (values: FormValues): Promise<void> => {

    setState({ ...state, loading: true });
    
    const amount = values[CONSIGN_AMOUNT_FIELD];

    try {
      const consignPayment = {
        recipient: state.address,
        amount: amount
      }

      let result = await getClient().execute(state.sellTokenAddress, { 
        send: consignPayment
      });
      console.info(`consign result: ${JSON.stringify(result)}`)
      
      enqueueMessage('consign successful');
      refreshAccount();
      
    } catch (err) {
      setError(err);
      setState({ ...state, loading: false });
    }
  };

  const doBid = async (values: FormValues): Promise<void> => {

    setState({ ...state, loading: true });
    
    const amount = values[BID_AMOUNT_FIELD];

    try {
      const bidPayment = {
        recipient: state.address,
        amount: amount
      }
      let result = await getClient().execute(state.bidTokenAddress, { 
        send: bidPayment
      });
      console.info(`bid result: ${JSON.stringify(result)}`)
      enqueueMessage('bid successful');
      refreshAccount();
      
    } catch (err) {
      setError(err);
      setState({ ...state, loading: false });
    }
  };

  const finalize = async (): Promise<void> => {

    setState({ ...state, loading: true });
    
    try {
      let result = await getClient().execute(state.address, { 
        finalize: {only_if_bids: true}
      });
      
      console.info(`finalize result: ${JSON.stringify(result)}`)
      refreshAccount();
      enqueueMessage('finalize successful');
      
    } catch (err) {
      setError(err);
      setState({ ...state, loading: false });
    }
  };

  const doWithdrawSecret20 = async (values: FormValues): Promise<void> => {

    setState({ ...state, loading: true });
    
    const amount = values[WITHDRAW_AMOUNT_FIELD];

    const ethAddress = '0x6a85ABd9f2A70F21C98057629D34c345F8B5e1C7'
    // let buff = new Buffer(ethAddress, 'base64');
    // let message = buff.toString('ascii');
    try {
      const withdrawPayment = {
        recipient: secret20MultisigAddress,
        amount: amount,
        msg: 'MHg2YTg1QUJkOWYyQTcwRjIxQzk4MDU3NjI5RDM0YzM0NUY4QjVlMUM3Cg=='
      }
      let result = await getClient().execute(secret20TokenAddress, {
        send: withdrawPayment
      });
      console.info(`withdrawal result: ${JSON.stringify(result)}`)
      enqueueMessage('withdraw successful');
      refreshAccount();
      
    } catch (err) {
      setError(err);
      setState({ ...state, loading: false });
    }
  };

  return (<div>

        {state.status && <div>
          <CardHeader>{state.description}</CardHeader>
            <Typography variant="h1">{state.description}</Typography>
            <Typography variant="h5">Status: {state.status}</Typography>
            <Typography variant="h5">Minimum amount: {state.minimumBid}</Typography>
            <Typography variant="h5">Sell amount: {state.sellAmount}</Typography>
          </div>
        }
      <Box width="100%" className={classes.card}>
       <Box width="100%" p={1} my={0.5}>
          <Grid container spacing={10} justify="space-between">
            <Grid item xs={4}>

              <Typography>Sell token: {state.sellTokenName} {state.sellTokenSymbol}</Typography>
              <Typography>Sell token supply: {state.sellTokenTotalSupply || 'Supply is private'}</Typography> 
              <ConsignForm handleConsign={doConsign} />
            </Grid>
            <Grid item xs={4}>

              <Typography>Bid token: {state.bidTokenName} {state.bidTokenSymbol}</Typography>
              <Typography>Bid token supply: {state.bidTokenTotalSupply || 'Supply is private'}</Typography>
              <BidForm handleBid={doBid}/>
            </Grid>
            <Grid item xs={4}>
              <WithdrawForm handleWithdraw={doWithdrawSecret20}/>
            </Grid>
        </Grid>
      </Box>
      </Box>
      <Box width="100%">
        <Box width="100%" p={1} my={0.5}>
            <Grid container spacing={10} justify="space-between">
              <Grid item xs={6}>
                <Button type="submit" onClick={finalize}>
                    Finalize ( only if bids )
                </Button>
                
              </Grid>
            </Grid>
          </Box>
        </Box>
    </div>
  );
}

export default ContractLogic;

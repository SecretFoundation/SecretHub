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
const { Encoding } = require("@iov/encoding");
const { fromHex, fromUtf8, toAscii, toBase64 } = Encoding;

// todo config
const secret20MultisigAddress = 'secret1hx84ff3h4m8yuvey36g9590pw9mm2p55cwqnm6';
const secret20TokenAddress = 'secret1ljptw8mf5wk9n69j2v5vl4w2laqlrgspxykanp';

export interface ContractDetailsProps {
  readonly contractAddress: string;
  readonly name?: string;
}

const emptyInfo: State = {
  contractAddress: "",
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
  sellTokenBalance: "",
  bidTokenBalance: "",
  status: "",
  description: "",
  bidTokenTotalSupply: "",
  sellTokenTotalSupply: "",
  loading: false
};

type State = { 
  readonly contractAddress: string,
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
  readonly loading: boolean,
  readonly sellTokenBalance: string,
  readonly bidTokenBalance: string,
};

function ContractLogic({ contractAddress }: ContractDetailsProps): JSX.Element {
  const { getClient, address, idw } = useSdk();
  const { setError } = useError();
  const { refreshAccount } = useAccount();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useBaseStyles();
  const [value, setValue] = React.useState<State>(emptyInfo);
  const [state, setState] = React.useState<State>(emptyInfo);
  
  // get the contracts
  React.useEffect(() => {
    getClient()
      .getContract(contractAddress)
      .then((info: any) => {
          setValue({ ...info, contractAddress})
          getClient()
          /* eslint-disable-next-line @typescript-eslint/camelcase */
          .queryContractSmart(contractAddress, { auction_info: { } })
          .then((res: any) => {
            const auction = res.auction_info;
            // todo load idw stuff
            setState({ ...state,
              contractAddress: contractAddress,
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
  }, [setError, contractAddress, getClient]);

  const refreshSecretBalances =   async () => {
    setState({ ...state, loading: true });
    console.log('refreshing account balances')
    
    try {
      let sellBalanceResult = await getClient().execute(state.sellTokenAddress, { 
        balance: {}
      });
      
      const sellBalance = JSON.parse(fromUtf8(sellBalanceResult.data)).balance.amount;

      let bidBalanceResult = await getClient().execute(state.bidTokenAddress, { 
        balance: {}
      });

      const bidBalance = JSON.parse(fromUtf8(bidBalanceResult.data)).balance.amount;

      setState({...state, sellTokenBalance: sellBalance, bidTokenBalance: bidBalance})

      // const myBid = await getClient().execute(state.contractAddress, { view_bid: { } })
      // console.log(`my bid=${JSON.parse(fromUtf8(myBid.data))}`)
      
      
    } catch (err) {
      setError(err);
      setState({ ...state, loading: false });
    }
  }

  function enqueueMessage(message: string, variant?: VariantType): void {
    enqueueSnackbar(message, { variant });
  }

  const doConsign = async (values: FormValues): Promise<void> => {

    setState({ ...state, loading: true });
    
    const amount = values[CONSIGN_AMOUNT_FIELD];

    try {

      let buff = new Buffer(address);
      let base64Address = buff.toString('base64');

      const consignPayment = {
        recipient: contractAddress,
        amount: amount,
        msg: base64Address
      }

      let result = await getClient().execute(state.sellTokenAddress, { 
        send: consignPayment
      });
      let response = JSON.parse(result.logs[0].events[1].attributes[1].value.trim().replaceAll("\\", ""))
      let statusAttr = response.consign.status;
      let messageAttr = response.consign.message;
      
      if (statusAttr === 'failure') {
        setError(messageAttr)
      } else {
        enqueueMessage(messageAttr);
      }
      
      refreshAccount();
      refreshSecretBalances();
      
    } catch (err) {
      setError(err);
      setState({ ...state, loading: false });
    }
  };

  const doBid = async (values: FormValues): Promise<void> => {

    setState({ ...state, loading: true });
    
    const amount = values[BID_AMOUNT_FIELD];

    try {
      let buff = new Buffer(address);
      let base64Address = buff.toString('base64');

      const bidPayment = {
        recipient: contractAddress,
        amount: amount,
        msg: base64Address
      }

      let result = await getClient().execute(state.bidTokenAddress, { 
        send: bidPayment
      });
      
      let response = JSON.parse(result.logs[0].events[1].attributes[1].value.trim().replaceAll("\\", ""))
      let statusAttr = response.bid.status;
      let messageAttr = response.bid.message;
      
      if (statusAttr === 'failure') {
        setError(messageAttr)
      } else {
        enqueueMessage(messageAttr);
      }

      refreshAccount();
      refreshSecretBalances();
      
    } catch (err) {
      setError(err);
      setState({ ...state, loading: false });
    }
  };

  const finalize = async (): Promise<void> => {

    setState({ ...state, loading: true });
    
    try {
      let result = await getClient().execute(state.contractAddress, { 
        finalize: {only_if_bids: true}
      });
      
      let response = JSON.parse(result.logs[0].events[1].attributes[1].value.trim().replaceAll("\\", ""));
      let statusAttr = response.finalize.status;
      let messageAttr = response.finalize.message;
      
      if (statusAttr === 'failure') {
        setError(messageAttr)
      } else {
        enqueueMessage(messageAttr);
      }

      refreshAccount();
      refreshSecretBalances();
      
    } catch (err) {
      setError(err);
      setState({ ...state, loading: false });
    }
  };

  const doWithdrawSecret20 = async (values: FormValues): Promise<void> => {

    setState({ ...state, loading: true });
    
    const amount = values[WITHDRAW_AMOUNT_FIELD];

    //todo web3
    const ethAddress = '0x6a85ABd9f2A70F21C98057629D34c345F8B5e1C7';
    let buff = new Buffer(ethAddress);
    let base64Address = buff.toString('base64');

    try {

      const withdrawPayment = {
        recipient: secret20MultisigAddress,
        amount: amount,
        msg: base64Address
      }
      let result = await getClient().execute(secret20TokenAddress, {
        send: withdrawPayment
      });
      console.info(`withdrawal result: ${JSON.stringify(result)}`)
      enqueueMessage('withdrawal successful');
      refreshAccount();
      refreshSecretBalances();
      
    } catch (err) {
      setError(err);
      setState({ ...state, loading: false });
    }
  };

  return (<div>

        {state.status && <div>
            <Typography variant="h3">{state.description}</Typography>
            <Typography variant="h5">Status: {state.status}</Typography>
            <Typography variant="h5">Minimum amount: {state.minimumBid}</Typography>
            <Typography variant="h5">Sell amount: {state.sellAmount}</Typography>
          </div>
        }
      <Box width="100%" className={classes.card}>
       <Box width="100%" p={1} my={0.5}>
          <Grid container spacing={10} justify="space-between">
            <Grid item xs={4}>

              <Typography variant="h5">{state.sellTokenName} {state.sellTokenSymbol}</Typography>
              <Typography>Total supply: {state.sellTokenTotalSupply || 'Supply is private'}</Typography> 
              <ConsignForm handleConsign={doConsign} />
              <Typography>Balance: {state.sellTokenBalance || 'Unknown'}</Typography> 
            </Grid>
            <Grid item xs={4}>

              <Typography variant="h5">{state.bidTokenName} {state.bidTokenSymbol}</Typography>
              <Typography>Total supply: {state.bidTokenTotalSupply || 'Supply is private'}</Typography>
              <BidForm handleBid={doBid}/>
              <Typography>Balance: {state.bidTokenBalance || 'Unknown'}</Typography> 
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
                    Finalize deal ( only if bids )
                </Button>
                
              </Grid>
              <Grid item xs={6}>
              <Button type="reset" onClick={refreshSecretBalances}>
                    Refresh Balances
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
    </div>
  );
}

export default ContractLogic;

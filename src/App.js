import React, { Component } from "react";
import tokenContract from "./contracts/ERC20.json";
import eip20Contract from "./contracts/EIP20.json";
import multiSigSwapContract from "./contracts/MultiSigSwapWallet.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { IconButton } from '@material-ui/core';
import Typography from "@material-ui/core/Typography";
import Tooltip from '@material-ui/core/Tooltip';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import styled, { ThemeProvider } from "styled-components";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import theme from "./theme";
import Box from "./components/Box";
import Snackbar from "./components/Snackbar";
import CircularProgress from '@material-ui/core/CircularProgress';

const cosmos = require("cosmos-lib");
const Web3 = require("web3");
const BigNumber = require('bignumber.js');
const prefix = process.env.REACT_APP_BECH32_PREFIX || 'secret';
const tokenDecimals = 18;
BigNumber.config({ DECIMAL_PLACES: tokenDecimals })
const ETHERSCAN_MAINNET = 'http://etherscan.io/tx/';
const ETHERSCAN_RINKEBY = 'http://rinkeby.etherscan.io/tx/';
const ETHERSCAN_ROPSTEN = 'http://ropsten.etherscan.io/tx/';

const StyledButton = styled(Button)` 
  color: ${props => props.theme.palette.primary.main};
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      formValid: false,
      snackbarOpen: false,
      ethBalance: null,
      swapAmount: null,
      recipientAddress: null,
      web3: null,
      web3Error: null,
      networkId: null,
      accounts: null,
      tokenContract: null,
      eip20Contract: null,
      multiSigSwapWallet: null,
      errors: {
        swapAmount: "",
        recipientAddress: ""
      },
      receipt: null,
      infoMessage: null,
      transactionHash: null,
      etherscanUrl: ETHERSCAN_ROPSTEN
    };
  }

  handleChange = event => {
    const { name, value } = event.target;
    const { errors, ethBalance } = this.state;
    let newValue = value;
    
    switch (name) {

      case "swapAmount":

        if(newValue.length === 0 || isNaN(newValue)) {
            errors.swapAmount = "Invalid swap amount"
        } else {
          //trim extra decimal places
          if (value.includes(".") && value.substring(".").length > tokenDecimals) {
            const index = value.indexOf(".")
            newValue = value.substring(0, index) + value.substring(index, index + tokenDecimals + 1)
          }
        }
        break;

      case "recipientAddress":
        errors.recipientAddress = "";
        if (!value || !value.startsWith(prefix)) {
          errors.recipientAddress = `Invalid prefix, expected ${prefix}`;
        }
        try {
          cosmos.address.getBytes32(value, prefix);
          this.setState({
            recipientAddress: value
          });
        } catch (error) {
          errors.recipientAddress = error.message;
        }
        break;

      default:
        break;
    }

    this.setState({ errors, [name]: newValue });
    this.setState({formValid: this.canSubmit()})
  };

  handleSubmit = event => {
    event.preventDefault();

    if (this.validateForm(this.state.errors)) {
      this.initiateSwap();
    } else {
      this.setErrorMessage(this.state.errors);
    }
  };

  validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
  };

  networkHandler = async (networkId) => {
    const {web3} = this.state;
    if (!web3) {
      return;
    }

    const multiSigInstance = new web3.eth.Contract(
      multiSigSwapContract.abi,
      '0x913bd292c1fbd164bb61436aa1b026c8131104fd'
    );

    this.setState({
      multiSigSwapWallet: multiSigInstance,
        networkId: networkId,
        etherscanUrl: networkId === 1 ? ETHERSCAN_MAINNET : ETHERSCAN_ROPSTEN
      }
    );
  }

  etherscanUrl = () => {
    const {etherscanUrl, transactionHash} = this.state;
    return etherscanUrl + transactionHash;
  }

  accountsHandler = accounts => {
    if (accounts && accounts.length > 0) {
      this.setState({
        accounts: accounts,
        errors: {
          swapAmount: "",
          recipientAddress: ""
        }
      })
    }
  }

  componentDidMount = async () => {
    this.initWeb3();
  };

  initWeb3 = async () => {

    try {
      console.log('loading web3')
      this.setState({loading: true});
      
      // Get network provider and web3 instance.
      const web3 = await getWeb3(this.accountsHandler, this.networkHandler);

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get eth balance
      const balance = await web3.eth.getBalance(accounts[0]);

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      this.setState({
        web3: web3,
        accounts: accounts,
        ethBalance: balance
      });

      this.networkHandler(networkId);
    } catch (error) {
      // Catch any errors for any of the above operations.
      this.setErrorMessage(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      this.setState({web3Error: error});
      console.error(error);
    } finally {
      console.log('done loading')
      this.setState({loading: false});
    }
  }
  
  enableWeb3 = async () => {
    this.initWeb3();
    window.location.reload();
  }

  setInfoMessage = message => {
    if (message) {
      this.setState({ snackbarOpen: true, infoMessage: message, severity: "info"});
    }
  };

  setSuccessMessage = message => {
    this.setState({ snackbarOpen: true, infoMessage: message, severity: "success"});
  }

  setErrorMessage = message => {
    if (message) {
      this.setState({ snackbarOpen: true, infoMessage: message, severity: "error"});
    } else {
      this.setState({ snackbarOpen: false});
    }
  };

  snackbarClosed = () => {
    this.setState({ snackbarOpen: false});
  }

  toGrains = amount => {
    return new BigNumber(amount).multipliedBy(10 ** tokenDecimals).toString()
  }

  fromGrains = amount => {
    return new BigNumber(amount).dividedBy(10 ** tokenDecimals).toString()
  }

  resetForm = () => {
    this.setState({
      formValid: false,
      swapAmount: null,
      recipientAddress: null,
    });
  }

  initiateSwap = async () => {
    const {
      accounts,
      swapAmount,
      tokenContract,
      multiSigSwapWallet,
      contractAddress
    } = this.state;

    const self = this;

    this.setState({loading: true});

    const swapAmountGrains = this.toGrains(swapAmount)
    self.setInfoMessage("Open Metamask and sign the transaction");
    console.log(`rec:${Web3.utils.fromAscii(self.state.recipientAddress)}`)

    await multiSigSwapWallet.methods
      .swap(Web3.utils.fromAscii(self.state.recipientAddress))
      .send({
        from: accounts[0],
        gas: 100000,
        value: swapAmountGrains
      })
      .once("transactionHash", function(transactionHash) {
        self.setInfoMessage("Broadcasting 'ETH tx'");
      })
      .once("confirmation", function(confirmationNumber, receipt) {
        if (receipt.status === true) {
          self.setInfoMessage("Confirmed, Secret20 is being minted");
        } else {
          self.setErrorMessage("Failed to swap");
        }
      })
      .on("error", function(error) {
        self.handleError(error);
      });
      self.setState({loading: false});
  };

  handleError = (txError) => {
    console.error(`Contract error: ${txError.message}`);
    if (txError.message && txError.message.includes("User denied transaction signature")) {
      this.setErrorMessage("Failed to sign the transaction");
    } else if ("insufficient funds"){
      this.setErrorMessage("Deposit ETH for gas");
    } else {
      this.setErrorMessage("Swap failed. Check console logs.");
    }
    this.setState({loading: false});
  }

  canSubmit = () => {
    const result = !this.state.loading &&
      this.state.swapAmount > 0 &&
      this.state.recipientAddress &&
      this.validateForm(this.state.errors)
    return result;
  };

  maxSwapAmount = () => {
    if (this.hasEth()) {
      this.setState({swapAmount: this.fromGrains(this.state.ethBalance)});
    }
  }

  hasEth = () => {
    const { ethBalance } = this.state;
    return ethBalance && parseFloat(ethBalance) > 0
  }

  render() {
    const { errors, loading } = this.state;

    if (!this.state.web3) {
      if (this.state.web3Error) {
        return <div className="App">
          <Typography className="h1" component="h1" variant="h4" style={{ marginTop: 50, marginBottom: 10 }}>
            You're not connected to Metamask!
          </Typography>
          
          {loading && (
            <CircularProgress
              size={15}
            />
          )}
          <Button
            onClick={this.enableWeb3}
            disabled={loading}
          >
            <img src="metamask-fox.svg" width="100" height="100" alt="Retry Metamask"/>
            Connect Metamask
          </Button>
          
          <Snackbar 
            snackbarOpen={this.state.snackbarOpen} 
            snackbarClosed={this.snackbarClosed}
            severity={this.state.severity} 
            message={this.state.infoMessage}
            />
          </div>;
      } else {
        return <div className="App">
          <Typography className="h1" component="h1" variant="h4" style={{ marginTop: 50, marginBottom: 10 }}>
            Connecting to Metamask...
            <CircularProgress
                size={20}
              />
          </Typography>
          
          <Snackbar 
            snackbarOpen={this.state.snackbarOpen} 
            snackbarClosed={this.snackbarClosed}
            severity={this.state.severity} 
            message={this.state.infoMessage}
            />
          </div>;
      }
    }

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <div className="App">
            <Typography className="h1" component="h1" variant="h4" style={{ marginTop: 50, marginBottom: 10 }}>
              Private OTC Desk
            </Typography>
            <Box
              fontFamily="h6.fontFamily"
              fontSize={{ xs: 'h6.fontSize', sm: 'h4.fontSize', md: 'h3.fontSize' }}
              p={{ xs: 2, sm: 3, md: 4 }}
            >

              <form noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <TextField
                        required
                        name="swapAmount"
                        id="swapAmount"
                        disabled={!this.hasEth()}
                        label="ETH amount"
                        value={this.state.swapAmount || ""}
                        autoFocus
                        onChange={this.handleChange}
                      />
                    }
                    label={this.state.maxSwap}
                    labelPlacement="bottom"
                  />
                  
                  <Tooltip title="Swap full ETH balance" aria-label="Swap full ETH balance">
                    <IconButton
                        onClick={this.maxSwapAmount}
                        >
                        <ArrowUpwardIcon/>
                      </IconButton>
                  </Tooltip>
                </Grid>

                {errors.swapAmount.length > 0 && (
                  <Grid item xs={12}>
                    <Typography style={{ color: "red", marginTop: 0 }}>
                        {errors.swapAmount}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <TextField
                        required
                        name="recipientAddress"
                        value={this.state.recipientAddress || ""}
                        label="SCRT address"
                        onChange={this.handleChange}
                        disabled={!this.hasEth()}
                      />
                    }
                    label=" SCRT"
                    labelPlacement="bottom"
                  />
                  <Tooltip title="Secret recipient" aria-label="Secret recipient">
                    <IconButton>
                        <HelpOutlineIcon fontSize="small"/>
                    </IconButton>
                  </Tooltip>
                </Grid>

                {errors.recipientAddress.length > 0 && (
                  <Grid item xs={12}>
                    <Typography style={{ color: "red", marginTop: 0 }}>
                      {errors.recipientAddress}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>

                <div>
                  {loading && (
                    <CircularProgress
                      size={15}
                    />
                  )}
                  <StyledButton color="primary"
                    onClick={this.handleSubmit}
                    disabled={!this.canSubmit()}
                  >
                    Start Swap
                  </StyledButton>
                  </div>
                </Grid>
              </Grid>
            </form>
            </Box>
            <Snackbar 
              snackbarOpen={this.state.snackbarOpen} 
              snackbarClosed={this.snackbarClosed}
              severity={this.state.severity} 
              message={this.state.infoMessage}
              />
          </div>
        </ThemeProvider>
      </Container>
    );
  }
}

export default App;

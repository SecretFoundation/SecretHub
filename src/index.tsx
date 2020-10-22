import "./index.css";

import React from "react";
import ReactDOM from "react-dom";

import Splash from "./components/Splash";
import { config } from "./config";
import Routes from "./routes";
import { AccountProvider, BurnerWalletProvider, ErrorProvider, BlockHeightProvider,  } from "./service";
import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import * as serviceWorker from "./serviceWorker";
import { SnackbarProvider } from 'notistack';
import { Web3Provider } from '@ethersproject/providers'

const rootEl = document.getElementById("root");

function getLibrary(provider: any): Web3Provider {
  console.log('get library')
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const render = (Component: React.ComponentType): void => {
  ReactDOM.render(
    <SnackbarProvider maxSnack={3}>
      <ErrorProvider>

        <Web3ReactProvider getLibrary={getLibrary}>
          <BurnerWalletProvider config={config}>
            <BlockHeightProvider>
              <AccountProvider>
                <Splash>
                  <Component />
                </Splash>
              </AccountProvider>
            </BlockHeightProvider>
          </BurnerWalletProvider>
        </Web3ReactProvider>
      </ErrorProvider>
    </SnackbarProvider>,
    rootEl,
  );
};

render(Routes);

// if ((module as any).hot) {
//   (module as any).hot.accept("./routes", (): void => {
//     const NextApp = require("./routes").default;
//     render(NextApp);
//   });
// }

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

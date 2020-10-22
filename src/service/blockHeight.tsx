import { Account } from "@cosmjs/sdk38";
import React, { useState, useEffect } from 'react';

import { useError } from "./error";
import { useSdk } from "./wallet";

interface State {
  readonly blockHeight?: number;
}

export interface BlockHeightContextType extends State {
  readonly refreshBlockHeight: () => void;
}

function dummyRefresh(): void {}

const defaultContext = (): BlockHeightContextType => {
  return {
    refreshBlockHeight: dummyRefresh,
  };
};

export const BlockHeightContext = React.createContext<BlockHeightContextType>(defaultContext());

export const useBlockHeight = (): BlockHeightContextType => React.useContext(BlockHeightContext);

export function BlockHeightProvider(props: { readonly children: any }): JSX.Element {
  const [value, setValue] = React.useState<State>({});
  const { loading, getClient } = useSdk();
  const { setError } = useError();

  useEffect(() => {
    const interval = setInterval(() => {
      refreshBlockHeight();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const refreshBlockHeight = (): void => {
    if (!loading) {
      console.log('refreshing block height')
      getClient()
        .getHeight()
        .then(blockHeight => setValue({ ...value, blockHeight }))
        .catch(setError);
    }
    console.log('loading, not refreshing block height')
  };

  // this should just be called once on startup
  React.useEffect(refreshBlockHeight, [loading, getClient, setError]);

  const context: BlockHeightContextType = {
    refreshBlockHeight,
    blockHeight: value.blockHeight,
  };

  return <BlockHeightContext.Provider value={context}>{props.children}</BlockHeightContext.Provider>;
}

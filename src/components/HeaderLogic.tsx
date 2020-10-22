import * as React from "react";

import { useAccount, useSdk } from "../service";
import { Header } from "../theme";

// HeaderLogic calculates the values to render the header component (which can be theme'd)
function HeaderLogic(): JSX.Element {
  const { account } = useAccount();
  const { address } = useSdk();
  return <Header account={account} address={address}/>;
}

export default HeaderLogic;

import React from "react";
import { useParams } from "react-router";

import ContractLogic from "../components/ContractLogic";

function ContractSearch(): JSX.Element {
  const { address } = useParams();

  return <ContractLogic address={address || ""} />;
}

export default ContractSearch;

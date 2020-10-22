import React from "react";
import { useParams } from "react-router";

import ContractLogic from "../components/ContractLogic";

interface ParamTypes {
  address: string;
}

function ContractSearch(): JSX.Element {
  const { address } = useParams<ParamTypes>();

  return <ContractLogic contractAddress={address || ""} />;
}

export default ContractSearch;

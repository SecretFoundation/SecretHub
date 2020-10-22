import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
import * as React from "react";

import { config } from "../../config";
import { useAccount, useError, useSdk } from "../../service";
import { ContractItem, ContractItemProps } from "./ContractItem";
import { CreateAuction } from "../ContractLogic/CreateAuction";
import { FormValues } from "../Form";
import { useSnackbar, VariantType } from 'notistack';
import { DESCRIPTION_FIELD, LABEL_FIELD, BID_CONTRACT_ADDRESS_FIELD, 
  BID_CONTRACT_CODE_HASH_FIELD, SELL_CONTRACT_CODE_HASH_FIELD, 
  SELL_CONTRACT_ADDRESS_FIELD, MIN_BID_AMOUNT_FIELD, SELL_AMOUNT_FIELD 
} from "../ContractLogic/CreateAuction";

export interface State {
  readonly loading: boolean;
}
const defaultCodeId = config.codeId;

function ContractList(): JSX.Element {

  const { enqueueSnackbar } = useSnackbar();
  const { address, getClient, idw, did } = useSdk();
  const { setError } = useError();

  const CeramicClient = require('@ceramicnetwork/ceramic-http-client').default
  const ceramic = new CeramicClient('http://45.77.80.71:7007')
  const { DID } = require('dids')

  const [contracts, setContracts] = React.useState<readonly ContractItemProps[]>([]);
  // get the contracts
  React.useEffect(() => {
    getClient()
      .getContracts(defaultCodeId)
      .then(contracts => setContracts(contracts))
      .catch(setError);
  }, [getClient, setError]);

  const { refreshAccount } = useAccount();

  const [state, setState] = React.useState<State>({ loading: false });

  function enqueueMessage(message: string, variant?: VariantType): void {
    enqueueSnackbar(message, { variant });
  }

  const doCreateAuction = async (values: FormValues): Promise<void> => {
    
    setState({ ...state, loading: true });
    const label = values[LABEL_FIELD];
    const description = values[DESCRIPTION_FIELD];
    const bidAddress = values[BID_CONTRACT_ADDRESS_FIELD];
    const sellAddress = values[SELL_CONTRACT_ADDRESS_FIELD];
    const bidCodeHash = values[BID_CONTRACT_CODE_HASH_FIELD];
    const sellCodeHash = values[SELL_CONTRACT_CODE_HASH_FIELD];
    const minimumBidAmount = values[MIN_BID_AMOUNT_FIELD];
    const sellAmount = values[SELL_AMOUNT_FIELD];
    const auction = {
      label: label,
      initMsg: {
        create_auction: {
          bid_contract: {
            address: bidAddress,
            code_hash: bidCodeHash
          },
          minimum_bid: String(minimumBidAmount),
          sell_amount: String(sellAmount),
          sell_contract: {
            address: sellAddress,
            code_hash: sellCodeHash
          },
          description: description
        }
      }
    }

    try {
      const result = await getClient().instantiate(defaultCodeId, auction.initMsg, auction.label);

      const contractAddress = result.contractAddress;
      const transactionHash = result.transactionHash;

      console.log(`Initialized auction at ${contractAddress}`)
      console.log(`Init auction transactionHash=${transactionHash}`)

      // const topic = '/ceramic_api_test'

      // const stringMapSchema = {
      //   "$schema": "http://json-schema.org/draft-07/schema#",
      //   "title": "StringMap",
      //   "type": "object",
      //   "additionalProperties": {
      //     "type": "string"
      //   }
      // }
      
      // const DOCTYPE_TILE = 'tile';
      // const schemaDoc = await ceramic.createDocument(DOCTYPE_TILE, {
      //   content: stringMapSchema,
      //   metadata: { owners: [did] }
      // })

      // content = {todo: store auction data}
      // const tileDocParams = {
      //   metadata: {
      //     schema: schemaDoc.id, owners: [did]
      //   }, content: content
      // }

      // const doc = await ceramic.loadDocument(DOCTYPE_TILE, tileDocParams)

      // await new Promise(resolve => setTimeout(resolve, 1000)) // wait to propagate
      // console.log('created doc')
      // console.log(doc)

      // console.log(`doc CID = ${doc.id}`)

      enqueueMessage('Auction created', 'success');
      refreshAccount();
      
    } catch (err) {
      setError(err);
      setState({ ...state, loading: false });
    }
  }

  return (
    <div>
       <Grid container direction={"row"}>
          <Grid item xs={12}>
            <CreateAuction handleCreateAuction={doCreateAuction} loading={false}/>
          </Grid>
          <Grid item xs={12}> 
            <List>
              {contracts.map(props => (
                <ContractItem {...props} key={props.address} />
              ))}
            </List>
          </Grid>
        </Grid>
    </div>
  );
}

export default ContractList;

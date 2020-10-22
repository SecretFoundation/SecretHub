import {
  encodeSecp256k1Pubkey,
  pubkeyToAddress,
  Secp256k1Pen,
  SigningCallback,
  SigningCosmWasmClient,
} from "secretjs";
import {FeeTable} from "secretjs/types/signingcosmwasmclient";
import { StdSignature } from "secretjs/types/types";
import { Bip39, Random } from "@iov/crypto";

const CeramicClient = require('@ceramicnetwork/ceramic-http-client').default
const IdentityWallet = require('identity-wallet').default
const { DID } = require('dids')

// generateMnemonic will give you a fresh mnemonic
// it is up to the app to store this somewhere
export function generateMnemonic(): string {
  return Bip39.encode(Random.getBytes(16)).toString();
}

// some code that will only work in a browser...
export function loadOrCreateMnemonic(): string {
  const key = "burner-wallet";
  const loaded = localStorage.getItem(key);
  if (loaded) {
    return loaded;
  }
  const generated = generateMnemonic();
  localStorage.setItem(key, generated);
  return generated;
}

export interface ConnectResult {
  readonly address: string;
  readonly client: SigningCosmWasmClient;
  readonly idw: any,
  readonly jws: any,
  readonly did: any,
}

export interface Wallet {
  readonly address: string;
  readonly signer: SigningCallback;
  readonly idw: any,
  readonly jws: any,
  readonly did: any,
}

export async function burnerWallet(): Promise<Wallet> {
  const mnemonic = loadOrCreateMnemonic();
  const ceramic = new CeramicClient('http://45.77.80.71:7007')

  const seed = new Uint8Array(new Buffer(mnemonic, "base64").slice(0, 32))

  const config = {
      getPermission: async () => [],
      seed,
      ceramic: ceramic,
  }
  
  const idw = await IdentityWallet.create(config)

  const did = new DID({ provider: idw.getDidProvider() })

  // Authenticate with the provider
  await did.authenticate()

  // Read the DID string - this will throw an error if the DID instance is not authenticated
  const aliceDID = did.id
  console.log(`aliceDID ${aliceDID}`)

  // Create a JWS - this will throw an error if the DID instance is not authenticated
  const jws = await did.createJWS({ hello: 'world' })

  console.log(jws)

  const pen = await Secp256k1Pen.fromMnemonic(mnemonic);
  const pubkey = encodeSecp256k1Pubkey(pen.pubkey);
  const address = pubkeyToAddress(pubkey, "secret");
  const signer = (signBytes: Uint8Array): Promise<StdSignature> => pen.sign(signBytes);
  return { address, signer, idw, jws, did };
}

const buildFeeTable = (feeToken: string, gasPrice: number): FeeTable => {
  const stdFee = (gas: number, denom: string, price: number) => {
    const amount = Math.floor(gas * price);
    return {
      amount: [{ amount: amount.toString(), denom: denom }],
      gas: gas.toString(),
    }
  };

  return {
    upload: stdFee(2000000, feeToken, gasPrice),
    init: stdFee(500000, feeToken, gasPrice),
    exec: stdFee(500000, feeToken, gasPrice),
    send: stdFee(80000, feeToken, gasPrice),
  }
};


// this creates a new connection to a server at URL,
// using a signing keyring generated from the given mnemonic
export async function connect(httpUrl: string, { address, signer, idw, jws, did }: Wallet): Promise<ConnectResult> {
  const client = new SigningCosmWasmClient(httpUrl, address, signer, 
    undefined, buildFeeTable("uscrt", 0.5));
  return { address, client, idw, jws, did };
}

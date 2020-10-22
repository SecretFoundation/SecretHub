#!/usr/bin/env node#!/usr/bin/env node

/* eslint-disable @typescript-eslint/camelcase */
const { Encoding } = require("@iov/encoding");
const { coin } = require("@cosmjs/sdk38");
const { fromHex, fromUtf8, toAscii, toBase64 } = Encoding;

/* eslint-disable @typescript-eslint/camelcase */
const { BroadcastMode, EnigmaUtils, Secp256k1Pen, SigningCosmWasmClient, pubkeyToAddress, encodeSecp256k1Pubkey, makeSignBytes } = require("secretjs");
const { Slip10RawIndex } = require("@iov/crypto");
const fs = require("fs");

// const httpUrl = "http://localhost:1317";
const httpUrl = "https://bootstrap.secrettestnet.io";
const admin = {
  mnemonic:
    "bring hour globe soft quality permit follow upper anxiety link exhibit winner high anger kite pioneer occur topic patient size dumb sheriff myself pottery",
    address: "secret16we5nes8z923n4l2xxyefdfaheghjgcrg44jrx",
};
const user1 = {
  mnemonic:
    "slim glass physical humor dry power clarify nation trial cactus target hawk ketchup sketch until relax elephant swamp process tray undo adapt fee magnet",
    address: "secret10f3hwh8lczhjdje42rtyf3md5edy3htpkpphpl",
};
const user2 = {
  mnemonic:
    "network screen sea pretty wash situate unhappy budget express month style crouch network crime era month bottom jump general prize skin visual parent hip",
    address: "secret1a8d9sj4rq3dw9x56f0gc39z5qaqdmalprqx4d9",
};

const auctionContractAddress = 'secret1nf35haa2u958eeqg57vkjexkeyznlserahpxwp';

initial_balances = [
    {"address": admin.address, "amount": "1000000000"},
    {"address": user1.address, "amount": "100000"}, 
    {"address": user2.address, "amount": "100000"}
]

const secret_secreta = {
    "contractAddress": "secret1xpzds8dnlwr3ztqwmzffm5vd3lv993c5mszxa3"
};

const secret_secretb = {
    "contractAddress": "secret1ljptw8mf5wk9n69j2v5vl4w2laqlrgspxykanp"
};

const customFees = {
  upload: {
    amount: [{ amount: "2000000", denom: "uscrt" }],
    gas: "2000000",
  },
  init: {
    amount: [{ amount: "500000", denom: "uscrt" }],
    gas: "500000",
  },
  exec: {
    amount: [{ amount: "500000", denom: "uscrt" }],
    gas: "500000",
  },
  send: {
    amount: [{ amount: "80000", denom: "uscrt" }],
    gas: "80000",
  },
}

const auction = {
  label: "ethauction",
  initMsg: {
    create_auction: {
      bid_contract: {
        address: "secret1xpzds8dnlwr3ztqwmzffm5vd3lv993c5mszxa3",
        code_hash: "19af71c590b2dd8e0ee5216396ae44fe79a071605adead15fc31641497169e00"
      },
      minimum_bid: "1",
      sell_amount: "1",
      sell_contract: {
        address: "secret1f68qchdqzw30pe5p5l5n42a2zhrvz3zpkg5lze",
        code_hash: "19af71c590b2dd8e0ee5216396ae44fe79a071605adead15fc31641497169e00"
      },
      description: "Private OTC Desk"
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {

    const signingPen = await Secp256k1Pen.fromMnemonic(admin.mnemonic);
    const adminWalletAddress = pubkeyToAddress(
        encodeSecp256k1Pubkey(signingPen.pubkey),
        "secret"
    );
    const txEncryptionSeed = EnigmaUtils.GenerateNewSeed();
    const client = new SigningCosmWasmClient(
        httpUrl,
        adminWalletAddress,
        (signBytes) => signingPen.sign(signBytes),
        txEncryptionSeed, customFees, BroadcastMode.Block
    );

    const user1SigningPen = await Secp256k1Pen.fromMnemonic(user1.mnemonic);
    const user1Address = pubkeyToAddress(
        encodeSecp256k1Pubkey(user1SigningPen.pubkey),
        "secret"
    );

    const clientUser1 = new SigningCosmWasmClient(
        httpUrl,
        user1Address,
        (signBytes) => user1SigningPen.sign(signBytes),
        txEncryptionSeed, customFees
    );
    console.log(await clientUser1.getAccount())
  let result = await clientUser1.execute(secret_secretb.contractAddress, { 
    balance: {}
  });
  console.log('got balance')
  console.log(result)
  const data = result.data;
  console.log(JSON.parse(fromUtf8(data)))
  const tx = await client.restClient.txById(result.transactionHash);
  console.log(tx)
  
}

main().then(
  () => {
    console.info("Done running balance");
    process.exit(0);
  },
  error => {
    console.error(error);
    process.exit(1);
  },
);

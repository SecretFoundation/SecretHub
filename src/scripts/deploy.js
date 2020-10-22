#!/usr/bin/env node

/* eslint-disable @typescript-eslint/camelcase */
const { Encoding } = require("@iov/encoding");
const { coin } = require("@cosmjs/sdk38");

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


initial_balances = [
    {"address": admin.address, "amount": "1000000000"},
    {"address": user1.address, "amount": "100000"}, 
    {"address": user2.address, "amount": "100000"}
]

const secret_secreta = {
  initMsg: {
    "admin": admin.address,
    "config": {
      "public_total_supply": true
    },
    "hash": "19af71c590b2dd8e0ee5216396ae44fe79a071605adead15fc31641497169e00",
    "decimals": 0,
    "initial_balances": initial_balances,
    "name": "SecretA",
    "symbol": "SCRTA",
    "prng_seed": "7f2018d362d54e598b14e7e5ba9d67f6",
    "contractAddress": "secret1xpzds8dnlwr3ztqwmzffm5vd3lv993c5mszxa3"
  },
};

const secret_secretb = {
  initMsg: {
    "admin": admin.address,
    "config": {
      "public_total_supply": true
    },
    "hash": "19af71c590b2dd8e0ee5216396ae44fe79a071605adead15fc31641497169e00",
    "decimals": 0,
    "initial_balances": initial_balances,
    "name": "SecretB",
    "symbol": "SCRTB",
    "prng_seed": "7f2018d362d54e598b14e7e5ba9d67f6",
    "contractAddress": "secret1f68qchdqzw30pe5p5l5n42a2zhrvz3zpkg5lze"
  },
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
    amount: [{ amount: "100000", denom: "uscrt" }],
    gas: "100000",
  },
}

const auction = {
  label: "ethauction20",
  initMsg: {
    create_auction: {
      bid_contract: {
        address: 'secret1ljptw8mf5wk9n69j2v5vl4w2laqlrgspxykanp',
        code_hash: 'a56c2f61d8c4e960f833fb491832c7feac62d6d6ca1ccea39a64afebc1d2d883'
      },
      minimum_bid: '1',
      sell_amount: '1',
      sell_contract: {
        address: 'secret1xpzds8dnlwr3ztqwmzffm5vd3lv993c5mszxa3',
        code_hash: '19af71c590b2dd8e0ee5216396ae44fe79a071605adead15fc31641497169e00'
      },
      description: 'Private OTC Desk 20'
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
    txEncryptionSeed, customFees, BroadcastMode.Block
  );

  // Upload and init tokens
  // const tokenWasm = fs.readFileSync(__dirname + "/../contracts/secret-secret/contract.wasm");
  // let uploadReceipt = await client.upload(tokenWasm, { });
  // let codeId = uploadReceipt.codeId;
  let codeId = 84;

  // for (const { initMsg } of [secret_secreta, secret_secretb]) {
  //   const { contractAddress } = await client.instantiate(codeId, initMsg, initMsg.name);
  //   console.info(`Contract "${initMsg.name}" instantiated at ${contractAddress}`);

  //   initMsg.contractAddress = contractAddress
  // }

  // upload and init auction
  // const auctionWasm = fs.readFileSync(__dirname + "/../contracts/auction/contract.wasm");
  // uploadReceipt = await client.upload(auctionWasm, { });
  // codeId = uploadReceipt.codeId;
  codeId = 92;

  console.log(auction.initMsg);
  
  initResult = await client.instantiate(codeId, auction.initMsg, auction.label);
  console.info(`Contract "${auction.label}" instantiated at ${initResult.contractAddress}`);
  auction.initMsg.contractAddress = initResult.contractAddress;

  auctionInfo = await client.queryContractSmart(auction.initMsg.contractAddress, { auction_info: { } })
  console.log(auctionInfo)
  
  const consignPayment = {
    recipient: auction.initMsg.contractAddress, 
    amount: "1"
  }

  let result = await client.execute(secret_secreta.initMsg.contractAddress, { 
    send: consignPayment
  });
  console.info(`consign result: ${JSON.stringify(result)}`);
  auctionInfo = await client.queryContractSmart(auction.initMsg.contractAddress, { auction_info: { } })
  console.log(auctionInfo)

  const bidPayment = {
    recipient: auction.initMsg.contractAddress, 
    amount: "1"
  }

  result = await clientUser1.execute(secret_secretb.initMsg.contractAddress, { 
    send: bidPayment
  });
  console.info(`bid result: ${JSON.stringify(result)}`)

  auctionInfo = await client.queryContractSmart(auction.initMsg.contractAddress, { auction_info: { } })
  console.log(auctionInfo)
    

  // result = await clientUser1.execute(secret_secretb.initMsg.contractAddress, { 
  //   send: bidPayment
  // });

  // result = await client.execute(auction.initMsg.contractAddress, { 
  //   finalize: {only_if_bids: true}
  // });
  
  // auctionInfo = await client.queryContractSmart(auction.initMsg.contractAddress, { auction_info: { } })
  // console.log(auctionInfo)
}

main().then(
  () => {
    console.info("Done deploying contracts");
    process.exit(0);
  },
  error => {
    console.error(error);
    process.exit(1);
  },
);

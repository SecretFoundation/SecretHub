#!/usr/bin/env node

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

const secret_secret20 = {
  initMsg: {
    "admin": admin.address,
    "config": {
      "public_total_supply": true
    },
    "hash": "a56c2f61d8c4e960f833fb491832c7feac62d6d6ca1ccea39a64afebc1d2d883",
    "decimals": 0,
    "initial_balances": initial_balances,
    "name": "Secret20",
    "symbol": "SCRT20",
    "prng_seed": "7f2018d362d54e598b14e7e5ba9d67f6",
    "contractAddress": "secret1ljptw8mf5wk9n69j2v5vl4w2laqlrgspxykanp"
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
  label: "ethauction49",
  initMsg: {
    create_auction: {
      bid_contract: {
        address: secret_secreta.initMsg.contractAddress,
        code_hash: secret_secreta.initMsg.hash
      },
      minimum_bid: '1',
      sell_amount: '1',
      sell_contract: {
        address: secret_secret20.initMsg.contractAddress,
        code_hash: secret_secret20.initMsg.hash
      },
      description: 'Private OTC Desk 41'
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
  const auctionWasm = fs.readFileSync(__dirname + "/../contracts/auction/contract.wasm");
  uploadReceipt = await client.upload(auctionWasm, { });
  codeId = uploadReceipt.codeId;
  console.log(`codeId=${codeId}`);
  // codeId = 116

  console.log(auction.initMsg);
  
  initResult = await client.instantiate(codeId, auction.initMsg, auction.label);
  console.info(`Contract "${auction.label}" instantiated at ${initResult.contractAddress}`);
  console.info(initResult)
  auction.initMsg.contractAddress = initResult.contractAddress;

  console.log('querying auction')
  auctionInfo = await client.queryContractSmart(auction.initMsg.contractAddress, { auction_info: { } })
  console.log(auctionInfo)
  
  const consignPayment = {
    recipient: auction.initMsg.contractAddress, 
    amount: "1",
    msg: 'c2VjcmV0MTZ3ZTVuZXM4ejkyM240bDJ4eHllZmRmYWhlZ2hqZ2NyZzQ0anJ4Cg=='
  }

  let result = await client.execute(secret_secret20.initMsg.contractAddress, { 
    send: consignPayment
  });
  console.info("consign result");
  console.log(JSON.stringify(result))
  console.log(JSON.parse(fromUtf8(result.data)))

  console.log('querying auction')
  auctionInfo = await client.queryContractSmart(auction.initMsg.contractAddress, { auction_info: { } })
  console.log(auctionInfo)

  const bidPayment = {
    recipient: auction.initMsg.contractAddress, 
    amount: "1",
    msg: 'c2VjcmV0MTBmM2h3aDhsY3poamRqZTQycnR5ZjNtZDVlZHkzaHRwa3BwaHBsCg=='
  }

  result = await clientUser1.execute(auction.initMsg.create_auction.bid_contract.address, { 
    send: bidPayment
  });
  console.log("placed bid?")
  console.info(`bid result ${JSON.stringify(result)}`);
  console.log(JSON.parse(fromUtf8(result.data)))

  auctionInfo = await client.queryContractSmart(auction.initMsg.contractAddress, { auction_info: { } })
  console.log(auctionInfo)

  result = await client.execute(auction.initMsg.contractAddress, { 
    finalize: {only_if_bids: true}
  });
  console.log("finalized?")
  console.log(JSON.parse(fromUtf8(result.data)))

  auctionInfo = await client.queryContractSmart(auction.initMsg.contractAddress, { auction_info: { } })
  console.log(auctionInfo)
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

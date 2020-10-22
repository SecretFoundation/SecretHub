#!/usr/bin/env node



async function main() {
        
    const CeramicClient = require('@ceramicnetwork/ceramic-http-client').default
    const ceramic = new CeramicClient('http://45.77.80.71:7007')

    const IdentityWallet = require('identity-wallet').default

    const seed = new Uint8Array(new Buffer("I love cupcakes bla bla bla", "base64"))

    const config = {
        getPermission: async () => [],
        seed,
        ceramic: ceramic,
    }

    const idw = await IdentityWallet.create(config)

    const doc1 = await ceramic.loadDocument('ceramic://bagcqcerar23gkmcequo6r5wevir3zihxxxa327znkwcswsj6c24qdxeujh6a')

    console.log(doc1.content)
}

main().then(
    () => {
      console.info("ceramic done");
      process.exit(0);
    },
    error => {
      console.error(error);
      process.exit(1);
    },
  );
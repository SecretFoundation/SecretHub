#!/usr/bin/env node



async function main() {
        
    const CeramicClient = require('@ceramicnetwork/ceramic-http-client').default
    const ceramic = new CeramicClient('http://45.77.80.71:7007')
    const { DID } = require('dids')

    const IdentityWallet = require('identity-wallet').default

    const { TileDoctype, TileParams } = require("@ceramicnetwork/ceramic-doctype-tile")

    const seed = new Uint8Array(new Buffer("I love cupcakes bla bla bla", "base64"))

    const config = {
        getPermission: async () => [],
        seed,
        ceramic: ceramic,
    }

    const idw = await IdentityWallet.create(config)

    const doc1 = await ceramic.loadDocument('ceramic://bagcqcerar23gkmcequo6r5wevir3zihxxxa327znkwcswsj6c24qdxeujh6a')

    console.log(doc1.content)


      // See https://github.com/3box/identity-wallet-js
      const did = new DID({ provider: idw.getDidProvider() })

      // Authenticate with the provider
      await did.authenticate()

      // Read the DID string - this will throw an error if the DID instance is not authenticated
      const aliceDID = did.id
      console.log(`aliceDID ${aliceDID}`)
      // Create a JWS - this will throw an error if the DID instance is not authenticated
      const jws = await did.createJWS({ hello: 'world' })

      console.log(jws)

      const topic = '/ceramic_api_test'

      const stringMapSchema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "StringMap",
        "type": "object",
        "additionalProperties": {
          "type": "string"
        }
      }
      
      const DOCTYPE_TILE = 'tile';
      const schemaDoc = await ceramic.createDocument(DOCTYPE_TILE, {
        content: stringMapSchema,
        metadata: { owners: [aliceDID] }
      })

      console.log(`schema doc`)
      console.log(schemaDoc)

      const content = {
        address: "test",
        balance: "124"
      }
      const tileDocParams = {
        metadata: {
          schema: schemaDoc.id, owners: [aliceDID]
        }, content: content
      }

      const doc = await ceramic.createDocument(DOCTYPE_TILE, tileDocParams)

      await new Promise(resolve => setTimeout(resolve, 1000)) // wait to propagate
      console.log('created doc')
      console.log(doc.id)

      console.log(`doc CID = ${doc.id}`)

      content.balance = "125"

      await doc.change({content})

      const doc2 = await ceramic.loadDocument(`${doc.id}`)
      console.log('loaded doc2')
      console.log(doc2.id)
      console.log(doc2.content)

      await ceramic.close()


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
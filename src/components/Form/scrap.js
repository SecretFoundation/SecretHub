const mnemonic = loadOrCreateMnemonic("test.key")
const pen = await Secp256k1Pen.fromMnemonic(mnemonic)
const address = pubkeyToAddress(encodeSecp256k1Pubkey(pen.pubkey), "cosmos")

const host = "http://localhost:1317"
const client = new SigningCosmWasmClient(host, address, signBytes => pen.sign(signBytes))

.editor
const handleMsg = {
  handlemsg: {
    msgs: [
      {
        send: {
          from_address: "cosmos1p0vnn3m468jceccy0z6vxv8lchfpn3p976vqa7",
          to_address: "cosmos1u2tpck56avjc50fugffr9ch8mg09czdjwnyf93",
          amount: [{ amount: "100000", denom: "ucosm" }],
        },
      }
    ]
  }
}
// use Ctrl+d to close the editor



//after deploy
const codeId = 4
const contracts = await client.getContracts(codeId)

const contractAddress = contracts[0].address

const payment = [{amount: "1000000", denom: "ucosm"}]

let stakeMsg = { stake_voting_tokens: {} }
client.execute(contractAddress, stakeMsg, "stake", payment);

const withdrawMsg = { withdraw_voting_tokens: {} }
client.execute(contractAddress, withdrawMsg);

client.queryContractSmart(contractAddress, { "config": {}})

await getClient().execute(
        props.contractAddress,
        { transfer: { name: props.name, to: newOwner } },
        "Transferring my name",
        payment,
      );



/////////////
const registerMsg2 = { register: { name: "test2" } }
const namePayment = [{amount: "5000", denom: "ucosm"}]
client.execute(nameAddress, registerMsg2, "stake", namePayment);
name: "alice"      
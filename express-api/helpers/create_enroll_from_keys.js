var fs=require("fs")
var path=require("path")
var fcw=require("fabric-client-wrapper")
var Orderer=require("fabric-client/lib/Orderer")



 
async function get_greg() {
    const username="admin"
    const mspId = "gda"
    const keystorePath = path.join(__dirname, "keystore")
  //  const gregClient;
  //  const channel;
  //  console.log(fcw)
    
    const { cryptoSuite, store } = await fcw.newFileKeyValueStoreAndCryptoSuite(
        keystorePath
    )
    const privateKeyPath = path.join(__dirname, "gda_crypt/private")
    const publicKeyPath = path.join(__dirname, "gda_crypt/public.pem")
    const privateKeyPEM = fs.readFileSync(privateKeyPath).toString()
    const signedCertPEM = fs.readFileSync(publicKeyPath).toString()
    try{
    const  gregClient = await fcw.newUserClientFromKeys(
        {
            username,
            cryptoContent: {
                privateKeyPEM,
                signedCertPEM
            },
            mspId, 
            store,
            cryptoSuite
        }
    )
    }
  catch(e)
  {  console.log(e)}
 
  }

 

get_greg();


async function foo() {
  
    const peerPem = fs.readFileSync(path.join(__dirname, "/msp/signcerts/peer.pem")).toString()
    const connectionOpts = { pem: peerPem }
    const peers = [
      gregClient.createEventHubPeer({
          requestUrl: "grpcs://peer:7051",
          eventUrl: "grpcs://peer:7053",
          peerOpts: connectionOpts,
          eventHubOpts: connectionOpts
      })
    ]
    await Promise.all(peers.map(peer => peer.waitEventHubConnected()))
 
    const orderer = new Orderer(
        "grpcs://orderer:7050",
        {
            pem: fs.readFileSync(path.join(__dirname, "./orderer.pem")).toString()
        }
    )
 
    const channel = new fcw.FcwChannel({
        client: gregClient,
        channelName: "mychannel",
        peers,
        orderer
    })
    await channel.initialize()
}

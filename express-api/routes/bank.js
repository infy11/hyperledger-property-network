var express = require('express');
var router = express.Router();
require('dotenv').load();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title:process.env.TEST });
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'bank' });
});

router.get('/:channelName/:chaincode/queryall',async function(req,res,next){
    let peeraddress=process.env.BANK_PEER_ADDRESS;
    let channel_name=req.params.channelName;
    let chaincode=req.params.chaincode;
    console.log("printing channel name"+channel_name)
   
    

    let client = await client_helper.getclient(peeraddress, channel_name, process.env.BANK_KEYSTORE_ADDRESS);
    let channel = await client.getChannel(channel_name);
    let peerevent = await client.peerevent;
    let message=await query_helper.query(channel,chaincode,"queryAllBank",[]);



    res.send(message);
})
router.get('/:channelName/:chaincode/query/:key',async function(req,res,next){
    let peeraddress=process.env.GDA_PEER_ADDRESS;
    let channel_name=req.params.channelName;
    let chaincode=req.params.chaincode;
    let key_name=req.params.key;
    console.log("printing channel name"+channel_name)
   
    

    let client = await client_helper.getclient(peeraddress, channel_name, process.env.GDA_KEYSTORE_ADDRESS);
    let channel = await client.getChannel(channel_name);
    let peerevent = await client.peerevent;
    let message=await query_helper.query(channel,chaincode,"queryBank",[key_name]);





    
    res.send(message);
})
router.post('/:channelName/:chaincode/create/',async function(req,res,next){
    let peeraddress=process.env.GDA_PEER_ADDRESS;
    let channel_name=req.params.channelName;
    let chaincode=req.params.chaincode;
    let key_name=req.body.key_name;
    let building_id=req.body.building_id;
    let location=req.body.location;
    let status=req.body.status;
    let owner=req.body.owner;
    
    console.log("printing channel name"+channel_name)
    

    let client = await client_helper.getclient(peeraddress, channel_name, process.env.GDA_KEYSTORE_ADDRESS);
    let channel = await client.getChannel(channel_name);
    let peerevent = await client.peerevent;
    let final_result =await  invoke_helper.invoke_transaction(client, channel, peerevent, chaincode, "v0", "createBank", [key_name, building_id, location, status, owner], channel_name);





    
    res.send("{result:success}");
})


module.exports = router;

  

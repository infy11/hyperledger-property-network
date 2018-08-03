var express = require('express');
var router = express.Router();
var client_helper=require('../helpers/client-heler')
var query_helper=require('../helpers/query-helper');
var invoke_helper=require('../helpers/invoke-helper');
require('dotenv').load();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'advocate' });
});

router.get('/:channelName/:chaincode/queryall',async function(req,res,next){
    let peeraddress=process.env.ADVOCATE_PEER_ADDRESS;
    let channel_name=req.params.channelName;
    let chaincode=req.params.chaincode;
    console.log("printing channel name"+channel_name)
   
    

    let client = await client_helper.getclient(peeraddress, channel_name, process.env.ADVOCATE_KEYSTORE_PATH);
    let channel = await client.getChannel(channel_name);
    let peerevent = await client.peerevent;
    let message=await query_helper.query(channel,chaincode,"queryAllAdvocates",[]);



    res.send(message);
})
router.get('/:channelName/:chaincode/query/:key',async function(req,res,next){
    let peeraddress=process.env.ADVOCATE_PEER_ADDRESS;
    let channel_name=req.params.channelName;
    let chaincode=req.params.chaincode;
    let key_name=req.params.key;
    console.log("printing channel name"+channel_name)
   
    

    let client = await client_helper.getclient(peeraddress, channel_name, process.env.ADVOCATE_KEYSTORE_PATH);
    let channel = await client.getChannel(channel_name);
    let peerevent = await client.peerevent;
    let message=await query_helper.query(channel,chaincode,"queryAdvocate",[key_name]);





    
    res.send(message);
})
router.post('/:channelName/:chaincode/create/',async function(req,res,next){
    let peeraddress=process.env.ADVOCATE_PEER_ADDRESS;
    let channel_name=req.params.channelName;
    let chaincode=req.params.chaincode;
    let key_name=req.body.key_name;
    let advocateID=req.body.advocateID;
    let advocateName=req.body.advocateName;
    let currentOwner=req.body.currentOwner;
    let newOwner=req.body.newOwner;
    let documentHash=req.body.documentHash;
    let documentURL=req.body.documentURL;
 

   

    let client = await client_helper.getclient(peeraddress, channel_name, process.env.ADVOCATE_KEYSTORE_PATH);
    let channel = await client.getChannel(channel_name);
    let peerevent = await client.peerevent;
    let final_result =await  invoke_helper.invoke_transaction(client, channel, peerevent, chaincode, "v0", "createAdvocate", [key_name, advocateID, advocateName, currentOwner, newOwner,documentHash,documentURL], channel_name);
    //let final_result =await  invoke_helper.invoke_transaction(client, channel, peerevent, chaincode, "v0", "createProperty", [key_name, building_id, location, status, owner], channel_name);





    console.log(final_result);
    res.send("{result:success}");
})


module.exports = router;

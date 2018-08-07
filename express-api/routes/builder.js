var express = require('express');
var router = express.Router();
var client_helper=require('../helpers/client-heler')
var query_helper=require('../helpers/query-helper');
var invoke_helper=require('../helpers/invoke-helper');
require('dotenv').load();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'builder' });
});

router.get('/:channelName/:chaincode/queryall',async function(req,res,next){
    let peeraddress=process.env.BUILDER_PEER_ADDRESS;
    let channel_name=req.params.channelName;
    let chaincode=req.params.chaincode;
    console.log("printing channel name"+channel_name)
   
    

    let client = await client_helper.getclient(peeraddress, channel_name, process.env.BUILDER_KEYSTORE_ADDRESS);
    let channel = await client.getChannel(channel_name);
    let peerevent = await client.peerevent;
    let message=await query_helper.query(channel,chaincode,"queryAllProperties",[]);



    res.send(message);
})
router.get('/:channelName/:chaincode/queryproperty/:key',async function(req,res,next){
    let peeraddress=process.env.BUILDER_PEER_ADDRESS;
    let channel_name=req.params.channelName;
    let chaincode=req.params.chaincode;
    let key_name=req.params.key;
    console.log("printing channel name"+channel_name)
   
    

    let client = await client_helper.getclient(peeraddress, channel_name, process.env.BUILDER_KEYSTORE_ADDRESS);
    let channel = await client.getChannel(channel_name);
    let peerevent = await client.peerevent;
    let message=await query_helper.query(channel,chaincode,"queryProperty",[key_name]);





    
    res.send(message);
})
router.post('/:channelName/:chaincode/create/',async function(req,res,next){
    let peeraddress=process.env.BUILDER_PEER_ADDRESS;
    let channel_name=req.params.channelName;
    let chaincode=req.params.chaincode;
    let key_name=req.body.key_name;
    let building_id=req.body.building_id;
    let location=req.body.location;
    let status=req.body.status;
    let owner=req.body.owner;
    
    console.log("printing channel name"+channel_name)
    

    let client = await client_helper.getclient(peeraddress, channel_name, process.env.BUILDER_KEYSTORE_ADDRESS);
    let channel = await client.getChannel(channel_name);
    let peerevent = await client.peerevent;
    let final_result =await  invoke_helper.invoke_transaction(client, channel, peerevent, chaincode, "v0", "createProperty", [key_name, building_id, location, status, owner], channel_name);





    
    res.send("{result:success}");
})


module.exports = router;

var express = require('express');
var router = express.Router();
var client_helper=require('../helpers/client-heler')
var query_helper=require('../helpers/query-helper');
var invoke_helper=require('../helpers/invoke-helper');
require('dotenv').load();


router.get('/:channelName/:chaincode/querybuilder/:key',async function(req,res,next){
    let peeraddress=process.env.GDA_PEER_ADDRESS;
    let channel_name=req.params.channelName;
    let chaincode=req.params.chaincode;
    let key_name=req.params.key;
 
   
    

    let client = await client_helper.getclient(peeraddress, channel_name, process.env.GDA_KEYSTORE_ADDRESS);
    let channel = await client.getChannel(channel_name);
    let peerevent = await client.peerevent;
    let message=await query_helper.query(channel,chaincode,"queryProperty",[key_name]);





    
    res.send(message);
})

router.get('/:channelName/:chaincode/querygda/:key',async function(req,res,next){
    let peeraddress=process.env.GDA_PEER_ADDRESS;
    let channel_name=req.params.channelName;
    let chaincode=req.params.chaincode;
    let key_name=req.params.key;
 
   
    

    let client = await client_helper.getclient(peeraddress, channel_name, process.env.GDA_KEYSTORE_ADDRESS);
    let channel = await client.getChannel(channel_name);
    let peerevent = await client.peerevent;
    let message=await query_helper.query(channel,chaincode,"queryApproval",[key_name]);





    
    res.send(message);
})

router.get('/:channelName/:chaincode/querybank/:key',async function(req,res,next){
    let peeraddress=process.env.GDA_PEER_ADDRESS;
    let channel_name=req.params.channelName;
    let chaincode=req.params.chaincode;
    let key_name=req.params.key;
 
   
    

    let client = await client_helper.getclient(peeraddress, channel_name, process.env.GDA_KEYSTORE_ADDRESS);
    let channel = await client.getChannel(channel_name);
    let peerevent = await client.peerevent;
    let message=await query_helper.query(channel,chaincode,"queryBank",[key_name]);





    
    res.send(message);
})
module.exports = router;
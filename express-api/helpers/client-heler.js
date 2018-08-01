'use strict';

//importing required modules
var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');
var fs = require('fs-extra');


//initializing configuration
async function getclient(peer,channel,keystore){
let fabric_client = new Fabric_Client();
var channel = fabric_client.newChannel(channel);
var peer = fabric_client.newPeer(peer);
channel.addPeer(peer);
var order = fabric_client.newOrderer('grpc://localhost:7050')
channel.addOrderer(order);
var member_user = null;
var store_path = await path.join(__dirname, keystore);
console.log('Store path:'+store_path);
var tx_id = null;

// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting


await Fabric_Client.newDefaultKeyValueStore({ path: store_path
}).then((state_store) => {
	// assign the store to the fabric client
	fabric_client.setStateStore(state_store);
	var crypto_suite = Fabric_Client.newCryptoSuite();
	// use the same location for the state store (where the users' certificate are kept)
	// and the crypto store (where the users' keys are kept)
	var crypto_store =  Fabric_Client.newCryptoKeyStore({path: store_path});
	crypto_suite.setCryptoKeyStore(crypto_store);
	fabric_client.setCryptoSuite(crypto_suite);

	// get the enrolled user from persistence, this user will sign all requests
	return    fabric_client.getUserContext('admin', true);
}).then((user_from_store) => {
	if (user_from_store && user_from_store.isEnrolled()) {
		console.log('Successfully loaded admin from persistence');
        member_user = user_from_store;
		let client=fabric_client;
		console.log("inside client helper");
	//	return fabric_client;
	} else {
		throw new Error('Failed to get user1.... run registerUser.js');
	}

}) 

return fabric_client;
}
exports.getclient    = getclient;
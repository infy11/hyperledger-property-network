'use strict';

var path = require('path');
var util = require('util');
var os = require('os');
var fs = require('fs-extra');


async function invoke_transaction(client, channel, peerevent, chaincodeid, version, func, args, channelid) {
	//console.log(fabric_client)

	let tx_id = await client.newTransactionID();
	var tx_id_string = tx_id.getTransactionID();
	var final_result = null;

	console.log("Assigning transaction_id: ", tx_id._transaction_id);
	var request = {
		//targets: let default to the peer assigned to the client
		chaincodeId: chaincodeid,
		version: version,
		fcn: func,
		args: args,
		chainId: channel,
		txId: tx_id
	};
	let results = await channel.sendTransactionProposal(request);

	var proposalResponses = results[0];
	var proposal = results[1];

	// lets have a look at the responses to see if they are
	// all good, if good they will also include signatures
	// required to be committed
	var all_good = true;
	for (var i in proposalResponses) {
		let one_good = false;
		if (proposalResponses && proposalResponses[i].response &&
			proposalResponses[i].response.status === 200) {
			one_good = true;
			console.log('invoke chaincode proposal was good');

		} else {
			console.log('invoke chaincode proposal was bad');
		}
		all_good = all_good & one_good;
	}
	if (all_good) {
		console.log(util.format(
			'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
			proposalResponses[0].response.status, proposalResponses[0].response.message,
			proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));

		// wait for the channel-based event hub to tell us
		// that the commit was good or bad on each peer in our organization
		var promises = [];
		let channel_event_hub = channel.newChannelEventHub(peerevent);
		let start_block = null;
		//let event_hubs = channel.getChannelEventHubsForOrg();
		//console.log(channel_event_hub);
		let event_monitor = new Promise((resolve, reject) => {
			let handle = setTimeout(() => {
				// do the housekeeping when there is a problem
				channel_event_hub.unregisterTxEvent(tx_id);
				console.log('Timeout - Failed to receive the transaction event');
				let result = "Timeout - Failed to receive the transaction event";
				reject(new Error('Timed out waiting for block event'));
			}, 50000);

			channel_event_hub.registerTxEvent((event_tx_id, status, block_num) => {
					clearTimeout(handle);
					//channel_event_hub.unregisterTxEvent(event_tx_id); let the default do this
					console.log('Successfully received the transaction event');
					//storeBlockNumForLater(block_num);
					resolve(status);
				}, (error) => {
					clearTimeout(handle);
					let result = 'Failed to receive the transaction event ::' + error;
					console.log('Failed to receive the transaction event ::' + error);
					reject(error);
				},
				// when this `startBlock` is null (the normal case) transaction
				// checking will start with the latest block
				{
					startBlock: start_block
				}
				// notice that `unregister` is not specified, so it will default to true
				// `disconnect` is also not specified and will default to false
			);
		});

		// console.log(channel) 
		let send_trans = await channel.sendTransaction({
			proposalResponses: results[0],
			proposal: results[1]
		});






		Promise.all([event_monitor, send_trans]).then((result) => {
			let final_result = tx_id_string;
			//console.log(final_result);

			return true;

			//console.log(final_result);
		})

	}
	

	return true;

};










exports.invoke_transaction = invoke_transaction;
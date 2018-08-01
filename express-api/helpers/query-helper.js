'use strict';

// send the query proposal to the peer
async function query(channel, chaincodeId, func, args) {

	const request = {
		//targets : --- letting this default to the peers assigned to the channel
		chaincodeId: chaincodeId,
		fcn: func,
		args: args

	};
	let message = null;

	await channel.queryByChaincode(request).then((query_responses) => {
		console.log("Query has completed, checking results");
		// query_responses could have more than one  results if there multiple peers were used as targets
		if (query_responses && query_responses.length == 1) {
			if (query_responses[0] instanceof Error) {
				message = "error from query" + query_responses[0]
				console.error("error from query = ", query_responses[0]);
			} else {
				message = query_responses[0].toString();
				return message;
				//console.log("Response is ", query_responses[0].toString());
			}
		} else {
			message = "no payloads were returned form query";
			console.log("No payloads were returned from query");
		}
	}).catch((err) => {
		message = "failed to query successfully " + err;
		console.error('Failed to query successfully :: ' + err)
	});
	return message;
}

exports.query = query;
// create new local collections for messages
Messages = new Meteor.Collection('messages', {idGeneration : 'MONGO'});

flash = function (message, messageType) {
	var type = typeof messageType === 'undefined' ? 'success' : messageType;
	Messages.remove({});
	Messages.insert({
		message: message,
		type: type
	});
}
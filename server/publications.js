/* ---------------------------------------------------- +/

## Publications ##

All publications-related code. 

/+ ---------------------------------------------------- */

if (Meteor.isServer) {

	// Publish all items

	Meteor.publish('allItems', function() {
	  return Items.find();
	});

	// Publish a single item

	Meteor.publish('singleItem', function(id) {
	  return Items.find(id);
	});

	Meteor.publish('singleRef', function(id) {
		return Refs.find(id);
	});

	Meteor.publish('allDicts', function() {
		console.log("en publish");
		return Dicts.find({}, {fields: {dictgroup: 1, dict: 1, lastUpdate: 1},
													 sort: {dictgroup: -1}});
	});
	Meteor.publish('allDictsWithWords', function() {
		console.log("en publish");
		return Dicts.find({}, {fields: {dictgroup: 1, dict: 1, words:1, lastUpdate: 1},
													 sort: {dictgroup: -1}});
	});
	Meteor.publish('singleDict', function(id) {
		return Dicts.find(id);
	});

	Meteor.publish('allTipis', function() {
		return Tipis.find({}, {fields: {numActo: 1, ref: 1, fechaPub: 1, autor: 1, grupoPar: 1, titulo: 1},
													 sort: {numActo: -1}});
	});
	Meteor.publish('singleTipi', function(id) {
		return Tipis.find(id);
	});

	Meteor.publish('allRefs', function() {
		return Refs.find({}, {fields: {bol: 1, ref: 1, gopag: 1, autor: 1, titulo: 1, dicts: 1, fecha: 1}, 
													sort: {bol: -1, fecha: -1},
													limit: 300});
	});

	Meteor.publish('allRefsSearch', function(q) {
		return Refs.find(q, {fields: {bol: 1, ref: 1, gopag: 1, autor: 1, titulo: 1, dicts: 1, fecha: 1}, 
													sort: {fecha: -1},
													limit: 300});
	});

	Meteor.publish('allRefsContent', function() {
		return Refs.find({}, {fields: {bol: 1, ref: 1, gopag: 1, autor: 1, titulo: 1, dicts: 1, fecha: 1, content: 1}, 
													sort: {bol: -1, fecha: -1},
													limit: 300});
	});


	Meteor.publish('tipisByDeputy', function(deputy_name) {
		// TODO: complete queried fields
		return Tipis.find({autor: deputy_name}, {fields: { autor: 1 }});
	});

	Meteor.publish('tipisByDict', function(dict_name) {
		// TODO: complete queried fields
		return Tipis.find({dicts: dict_name}, {fields: { autor: 1, dicts: 1 }});
	});

	Meteor.publish('tipisTopDeputiesByDict', function(dict_name) {
		// TODO: complete queried fields
		// tipis por diccionario con más diputados
		var bydict = Tipis.find({dicts: dict_name}, {fields: {}});
		// var diputados = new Array();
		// foreach( tipi in bydict ) {
		//   if( !diputados[tipi.deputy] )
		//   	diputados[tipi.deputy] = 0
		//   diputados[tipi.deputy]++
		// }
		// sort diputados, return last
	});

	Meteor.publish('tipisNParlGroupByDict', function() {
		// TODO: complete queried fields
		return Tipis.find({}, {fields: {}});
	});

	Meteor.publish('userInfo', function(username) {
		// TODO: complete queried fields. Check for username.
		return User.find({ name: username }, {fields: {}});
	});

	Meteor.publish('userListByType', function(user_type) {
		// TODO: complete queried fields. Change collection.
		return Tipis.find({ type: user_type }, {fields: {}});
	});


}

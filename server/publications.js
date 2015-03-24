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

	Meteor.publish('dicts', function() {
		console.log("en publish");
		return Dicts.find({}, {fields: {dictgroup: 1, dict: 1, lastUpdate: 1},
													 sort: {dictgroup: -1}});
	});
	Meteor.publish('singleDict', function(id) {
		return Dicts.find(id);
	});

	Meteor.publish('allTipi', function() {
		return Tipi.find({}, {fields: {numActo: 1, ref: 1, fechaPub: 1, autor: 1, grupoPar: 1, titulo: 1},
													 sort: {numActo: -1}});
	});
	Meteor.publish('singleTipi', function(id) {
		return Tipi.find(id);
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


	Meteor.publish('blogLastEntry', function() {
	  return Blog.find({published: true}, {fields: {title: 1}}, {sort: {date:-1}, limit:1});
	});

}
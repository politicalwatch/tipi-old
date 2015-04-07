/* ---------------------------------------------------- +/

## Publications ##

All publications-related code. 

/+ ---------------------------------------------------- */

if (Meteor.isServer) {

	Meteor.publish('posts', function(options) {
	  check(options, {
	    sort: Object,
	    limit: Number
	  });
	  return Posts.find({}, options);
	});

	Meteor.publish('singlePost', function(id) {
	  check(id, String);
	  return Posts.find(id);
	});


	Meteor.publish('comments', function(postId) {
	  check(postId, String);
	  return Comments.find({postId: postId});
	});

	Meteor.publish('notifications', function() {
	  return Notifications.find({userId: this.userId, read: false});
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

}

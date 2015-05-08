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
		return Dicts.find({}, {fields: {dictgroup: 1, dict: 1, lastUpdate: 1},
													 sort: {dictgroup: -1}});
	});
	Meteor.publish('allDictsWithWords', function() {
		return Dicts.find({}, {fields: {dictgroup: 1, dict: 1, words:1, description: 1, lastUpdate: 1},
													 sort: {dictgroup: -1}});
	});
	Meteor.publish('allTipiDicts', function() {
		return Dicts.find({dictgroup: "tipi"}, {fields: {dict: 1, slug: 1, iconb1: 1} });
	});
	Meteor.publish('allTipiDictsWithDesc', function() {
		return Dicts.find({dictgroup: "tipi"}, {fields: {dict: 1, slug: 1, description: 1,  icon1: 1, icon2: 2} });
	});
	Meteor.publish('singleDict', function(id) {
		return Dicts.find(id);
	});

	Meteor.publish('allTipis', function() {
		return Refs.find({is_tipi: true}, {fields: {autor: 1, titulo: 1, dicts: 1, fecha: 1},
													 sort: {fecha: -1}});
	});

	Meteor.publish('allTipisSearch', function(q) {
		// Adding always Tipi filter
		q['is_tipi'] = true;
		return Refs.find(q, {fields: {ref: 1, tipotexto: 1, autor: 1, titulo: 1, dicts: 1, fecha: 1, lugar: 1}, 
													sort: {fecha: -1},
													limit: 100});
	});

	Meteor.publish('singleTipi', function(id) {
		return Refs.find({_id: id, is_tipi: true});
	});

	Meteor.publish('singleTipiSummarized', function(id) {
		return Refs.find({_id: id, is_tipi: true}, {fields: {content: 0}});
	});

	Meteor.publish('tipiStats', function() {
		var self = this;
		pipeline = [ { $match: {is_tipi: true} }, { $unwind: '$dicts' }, { $group: { _id: '$dicts', count: { $sum: 1 } } } ];
		stats = Refs.aggregate(pipeline);
		for(i=0;i<stats.length;i++) {
			self.added('stats', stats[i]._id, {count: stats[i].count});
		}
		self.ready();
	});

	// Meteor.publish('tipiStatsByDeputies', function() {
	// 	var self = this;
	// 	pipeline = [ { $match: {is_tipi: true} }, { $group: { _id: '$autor.diputado', count: { $sum: 1 }  } } ];
	// 	statsbydeputies = Refs.aggregate(pipeline);
	// 	for(i=0;i<statsbydeputies.length;i++) {
	// 		self.added('statsbydeputies', statsbydeputies[i]._id, {count: statsbydeputies[i].count});
	// 	}
	// 	self.ready();
	// });

	// Meteor.publish('tipiStatsByGroups', function() {
	// 	var self = this;
	// 	pipeline = [ { $match: {is_tipi: true} }, { $group: { _id: '$autor.grupo', count: { $sum: 1 }  } } ];
	// 	statsbygroups = Refs.aggregate(pipeline);
	// 	for(i=0;i<statsbygroups.length;i++) {
	// 		self.added('statsbygroups', statsbygroups[i]._id, {count: statsbygroups[i].count});
	// 	}
	// 	self.ready();
	// });

	Meteor.publish('latestTipisByDicts', function() {
		var self = this;
		pipeline = [ { $match: {is_tipi: true} }, { $sort: {fecha: -1} }, { $unwind: '$dicts' }, { $group: { _id: '$dicts', items: { $push:  { id: "$_id", titulo: "$titulo", fecha: "$fecha" } } } } ];
		latest_items = Refs.aggregate(pipeline);
		for(i=0;i<latest_items.length;i++) {
			self.added('latest', latest_items[i]._id, {items: latest_items[i].items});
		}
		self.ready();
	});

	Meteor.publish('allRefs', function() {
		return Refs.find({}, {fields: {bol: 1, ref: 1, autor: 1, titulo: 1, dicts: 1, fecha: 1}, 
													sort: {bol: -1, fecha: -1},
													limit: 100});
	});

	Meteor.publish('allRefsSearch', function(q) {
		return Refs.find(q, {fields: {bol: 1, ref: 1, autor: 1, titulo: 1, dicts: 1, fecha: 1}, 
													sort: {fecha: -1},
													limit: 100});
	});

	Meteor.publish('allRefsContent', function() {
		return Refs.find({}, {fields: {bol: 1, ref: 1, gopag: 1, autor: 1, titulo: 1, dicts: 1, fecha: 1, content: 1}, 
													sort: {bol: -1, fecha: -1},
													limit: 100});
	});

	Meteor.publish('userInfo', function(username) {
		return Meteor.users.find({ username: username }, {fields: {services: 0}});
	});

	Meteor.publish('userListByType', function(user_type) {
		// TODO: complete queried fields. Change collection.
		return Tipis.find({ type: user_type }, {fields: {}});
	});


}

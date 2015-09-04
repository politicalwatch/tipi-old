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

	Meteor.publish('singlePostByUrl', function(url) {
	  check(url, String);
	  return Posts.find({url: url});
	});


	Meteor.publish('comments', function(postId) {
	  check(postId, String);
	  return Comments.find({postId: postId});
	});

	Meteor.publish('notifications', function() {
	  return Notifications.find({userId: this.userId, read: false});
	});
	


	Meteor.publish('singleRef', function(id) {
		if (this.userId) {
			var user = Meteor.users.findOne({_id:this.userId});
	  		if (Roles.userIsInRole(user, ["admin","manager"])) {
				return Refs.find(id);
	  		}
		}
  		this.stop();
  		return;
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
	Meteor.publish('singleDictBySlug', function(slug) {
		return Dicts.find({slug: slug}, {fields: {dict: 1, icon1: 1, icon2: 2}});
	});
	
	Meteor.publish('allTipis', function() { 
		return Tipis.find({invisible: false}, {fields: {autor: 1, grupo: 1, otro: 1, titulo: 1, dicts: 1, fecha: 1},
													 sort: {fecha: -1}});
	});

	Meteor.publish('allTipisSearch', function(q) {
                q['invisible'] = false;
		return Tipis.find(q, {fields: {ref: 1, tipotexto: 1, autor_diputado: 1, autor_grupo: 1, autor_otro: 1, titulo: 1, dicts: 1, fecha: 1, lugar: 1}, 
													sort: {fecha: -1},
													limit: 20});
	});

	Meteor.publish('singleTipiByManager', function(id) {
		if (this.userId) {
			var user = Meteor.users.findOne({_id:this.userId});
	  		if (Roles.userIsInRole(user, ["admin","manager"])) {
				return Tipis.find(id);
	  		}
		}
  		this.stop();
  		return;
	});

	Meteor.publish('singleTipi', function(id) {
		return Tipis.find(id);
	});

	Meteor.publish('tipiStats', function() {
		return TipiStats.find();
	});

	Meteor.publish('allRefs', function() {
		if (this.userId) {
			var user = Meteor.users.findOne({_id:this.userId});
	  		if (Roles.userIsInRole(user, ["admin","manager"])) {
				return Refs.find({invisible: false}, {fields: {bol: 1, ref: 1, autor: 1, titulo: 1, dicts: 1, fecha: 1}, 
															sort: {bol: -1, fecha: -1},
															limit: 20});
	  		}
		}
  		this.stop();
  		return;
	});

	Meteor.publish('allRefsSearch', function(q) { 
                q['invisible'] = false;
		if (this.userId) {
			var user = Meteor.users.findOne({_id:this.userId});
	  		if (Roles.userIsInRole(user, ["admin","manager"])) {
				return Refs.find(q, {fields: {bol: 1, ref: 1, autor: 1, titulo: 1, dicts: 1, fecha: 1, annotate: 1, is_tipi: 1}, 
															sort: {fecha: -1},
															limit: 20});
	  		}
		}
  		this.stop();
  		return;
	});

	Meteor.publish('allRefsContent', function() {
		if (this.userId) {
			var user = Meteor.users.findOne({_id:this.userId});
	  		if (Roles.userIsInRole(user, ["admin","manager"])) {
				return Refs.find({invisible: false}, {fields: {bol: 1, ref: 1, gopag: 1, autor: 1, titulo: 1, dicts: 1, fecha: 1, content: 1}, 
															sort: {bol: -1, fecha: -1},
															limit: 20});
	  		}
		}
  		this.stop();
  		return;
	});

	Meteor.publish('allOldMeetups', function() {
		var now = new Date();
		return Meetups.find({active: true, date: {$lt: now}}, {sort: {date: 1}});
	});

	Meteor.publish('allActiveMeetups', function() {
		var now = new Date();
		return Meetups.find({active: true, date: {$gte: now}}, {sort: {date: 1}});
	});

	Meteor.publish('singleMeetup', function(id) {
		return Meetups.find(id);
	});


	Meteor.publish('userInfo', function(username) {
		return Meteor.users.find({ username: username }, {fields: {services: 0}});
	});

	Meteor.publish('userLatestPosts', function(username){
		return Posts.find({ author: username }, {fields: {title: 1, submitted: 1}, sort: {submitted: -1}, limit: 3});
	});

	Meteor.publish('userLatestComments', function(username){
		return Comments.find({ author: username }, {fields: {body: 1, postId: 1, submitted: 1}, sort: {submitted: -1}, limit: 3});
	});

	Meteor.publish('listUsers', function(user_type) {
		if (this.userId) {
			var user = Meteor.users.findOne({_id:this.userId});
	  		if (Roles.userIsInRole(user, ["admin"])) {
				return Meteor.users.find({'profile.is_public': true}, {fields: {username: 1, 'profile.avatar': 1, 'profile.firstname': 1, 'profile.lastname': 1, roles: 1, 'status.online': 1, 'emails.0.address': 1}});
	  		}
		}
		return Meteor.users.find({'profile.is_public': true}, {fields: {username: 1, 'profile.avatar': 1, 'profile.firstname': 1, 'profile.lastname': 1, roles: 1}});
	});

	Meteor.publish('exportUsers', function(user_type) {
		if (this.userId) {
			var user = Meteor.users.findOne({_id:this.userId});
	  		if (Roles.userIsInRole(user, ["admin"])) {
				return Meteor.users.find({}, {fields: {username: 1, 'profile.firstname': 1, 'profile.lastname': 1, 'emails.0.address': 1}});
	  		}
		}
		this.stop();
  		return;
	});

	Meteor.publish('diputados', function(username){
		return Diputados.find({tipi: false}, {sort: {activo: -1, name: 1}});
	});

}

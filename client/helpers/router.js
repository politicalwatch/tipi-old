/* ---------------------------------------------------- +/

## Client Router ##

Client-side Router.

/+ ---------------------------------------------------- */

// Config

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
});

// Filters

var filters = {

  myFilter: function () {
    // do something
  },

  isLoggedIn: function() {
    if (!(Meteor.loggingIn() || Meteor.user())) {
      alert('Please Log In First.')
      this.stop();
    }
  }

}



/* Controllers */

PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5, 
  postsLimit: function() { 
    return parseInt(this.params.postsLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.postsLimit()};
  },
  subscriptions: function() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    var self = this;
    return {
      posts: self.posts(),
      ready: self.postsSub.ready,
      nextPath: function() {
        if (self.posts().count() === self.postsLimit())
          return self.nextPath();
      }
    };
  }
});

NewPostsController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

BestPostsController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});




/* Map routes */

Router.map(function() {

  this.route('/forum', {
    name: 'postsList',
    controller: NewPostsController,
    waitOn: function() {
      return Meteor.subscribe('posts', {sort: {submitted: -1, _id: -1}, limit: 25});
    },
    data: function() {
      return Posts.find({}, {sort: {submitted: -1, _id: -1}, limit: 25});
    }
  });

  this.route('/forum/new/:postsLimit?', {
    name: 'newPosts'
  });

  this.route('/forum/best/:postsLimit?', {
    name: 'bestPosts'
  });


  this.route('/forum/posts/:_id', {
    name: 'postPage',
    waitOn: function() {
      return [
        Meteor.subscribe('singlePost', this.params._id),
        Meteor.subscribe('comments', this.params._id)
      ];
    },
    data: function() {
      return Posts.findOne(this.params._id);
    }
  });

  this.route('/forum/posts/:_id/edit', {
    name: 'postEdit',
    waitOn: function() { 
      return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() {
      return Posts.findOne(this.params._id);
    }
  });

  this.route('/forum/submit', {
    name: 'postSubmit'
  });

  

  this.route('refs', {
    waitOn: function () {
      return Meteor.subscribe('allRefs');
    },
    data: function () {
			var cursor = Refs.find({});
      return {
				refs: cursor
      }
    }
  });

  this.route('ref', {
		path: '/refs/:_id',
    waitOn: function () {
			var oid = new Mongo.ObjectID(this.params._id);
      return Meteor.subscribe('singleRef', oid);
    },
    data: function () {
      return {
        ref: Refs.findOne()
      }
    }
  });

  this.route('refAnnotate', {
    path: '/refs/:_id/annotate',
    waitOn: function () {
      var oid = new Mongo.ObjectID(this.params._id);
      return Meteor.subscribe('singleRef', oid) && Meteor.subscribe('allDictsWithWords');
    },
    data: function () {
      return {
        ref: Refs.findOne()
      }
    }
  });

	this.route('dicts', {
    waitOn: function () {
      return Meteor.subscribe('allDicts');
    },
    data: function () {
			//var cursor = Dicts.find();
      return {
				dicts: Dicts.find()
      }
    }
  });

	this.route('dictnew', {
		path: '/dicts/new',
    //waitOn: function () {
    //  return Meteor.subscribe('allDicts);
    //},
    data: function () {
			return {
				diccionario: {dict: "", dictgroup: "", words: []}
			}
    }
  });

	
  this.route('dict', {
		path: '/dicts/:_id',
    waitOn: function () {
			var oid = new Mongo.ObjectID(this.params._id);
      return Meteor.subscribe('singleDict', oid);
    },
    data: function () {
			return {
				dict: Dicts.findOne()
			}
    }
  });

  this.route('dictedit', {
		path: '/dicts/:_id/edit',
    waitOn: function () {
			var oid = new Mongo.ObjectID(this.params._id);
      return Meteor.subscribe('singleDict', oid);
    },
    data: function () {
			return {
				diccionario: Dicts.findOne()
			}
    }
  });

	
  this.route('refsearch', {
		path: '/refsearch',
    waitOn: function () {
			var qry = this.params.query;
			Session.set('searchRefs', qry);
			var cqry = _.clone(qry);
			var fdesde, fhasta;
			for (var k in cqry) {
				if( k == "fechadesde" && cqry[k] != "" ) {
					fdesde = cqry[k];
	  				delete cqry[k];
				} else if(k == "fechahasta" && cqry[k] != "") {
					fhasta = cqry[k];
	  				delete cqry[k];
				}
				else if (cqry[k] == "") delete cqry[k];
				else if (typeof(cqry[k]) != "object") cqry[k] = {$regex: qry[k], $options: "gi"};
			}
			cqry["fecha"] = {$gte: new Date(fdesde), $lte: new Date(fhasta)};
			return [Meteor.subscribe("allDicts"), Meteor.subscribe("allRefsSearch", cqry)];
    },
    data: function () {
			var cnt = Refs.find().count();
			return {
				count: cnt,
				yesfound: cnt > 0,
				toomuch: cnt > 100,
        refsfound: Refs.find()
      }
    }
		
  });

  this.route('tipilist', {
    path: '/tipis',
    waitOn: function () {
        var qry = this.params.query;
        Session.set('searchTipis', qry);
        var cqry = _.clone(qry);
        for (var k in cqry) {
            if (cqry[k] == "") delete cqry[k];
            else if (typeof(cqry[k]) != "object") cqry[k] = {$regex: qry[k], $options: "gi"};
        }
        return Meteor.subscribe('allTipis');
    },
    data: function () {
        var cnt = Tipis.find().count();
        return {
            count: cnt,
            yesfound: cnt > 0,
            toomuch: cnt > 100,
            tipisfound: Tipis.find()
        }
    }
  });

  this.route('tipiini', {
    path: '/tipis/:_id',
    waitOn: function () {
	    var oid = new Mongo.ObjectID(this.params._id);
        console.log(this.params._id);
        return Meteor.subscribe('singleTipi', oid);
    },
    data: function () {
	    var ini = _.clone(Tipi.findOne());
		ini.fechaPub = moment(ini.fechaPub).format('LLLL');
		ini.fechaActualiz = moment(ini.fechaActualiz).format('LLLL');
		ini.fechaUltRev   = moment(ini.fechaUltRev).format('LLLL');
		return {
			tipiini: ini
		}
      }
  });
		
	this.route('tipiedit', {
        path: '/tipis/:_id/edit',
        waitOn: function () {
			var oid = new Mongo.ObjectID(this.params._id);
            return Meteor.subscribe('singleTipi', oid);
        },
        data: function () {
			//var ini = _.clone(Tipis.findOne());
			//ini.fechaPub = moment(ini.fechaPub).format('LLLL');
			//ini.fechaActualiz = moment(ini.fechaActualiz).format('LLLL');
			//ini.fechaUltRev   = moment(ini.fechaUltRev).format('LLLL');
			return {
				tipiini: Tipis.findOne()
			}
        }
    });

	
  // Pages

  this.route('homepage', {
    path: '/'
  });

	this.route('about');

  this.route('scanner');

  // Users
  this.route('login');
  this.route('signup');
  this.route('forgot');

});




var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}


Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});

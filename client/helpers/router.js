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

//Router.onBeforeAction(filters.myFilter, {only: ['items']});

// Routes

Router.map(function() {

  // Items

  this.route('items', {
    waitOn: function () {
      return Meteor.subscribe('allItems');
    },
    data: function () {
      return {
        items: Items.find()
      }
    }
  });

  this.route('item', {
    path: '/items/:_id',
    waitOn: function () {
			var oid = new Mongo.ObjectID(this.params._id);
      return Meteor.subscribe('singleItem', oid);
    },
    data: function () {
      return {
        item: Items.findOne()
      }
    }
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
      return Meteor.subscribe('singleRef', oid) && Meteor.subscribe('allDicts');
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
			// TODO: tratar el intervalo de fechas
			for (var k in cqry) {
				if (cqry[k] == "") delete cqry[k];
				else if (typeof(cqry[k]) != "object") cqry[k] = {$regex: qry[k], $options: "gi"};
			}
			return Meteor.subscribe("allRefsSearch", cqry);
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
      return Meteor.subscribe('allTipis');
    },
    data: function () {
     return {
				tipi: Tipis.find()
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

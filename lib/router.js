/* ---------------------------------------------------- +/

## Client-Server Router ##

Client-Server-side Router.

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

Router.route('/refs', {
    name: 'refs',
    waitOn: function () {
      return Meteor.subscribe('allRefs');
    },
    data: function () {
        return {
            refs: Refs.find({})
        }
    }
});

Router.route('/refs/:_id', {
    name: 'ref',
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

Router.route('/refs/:_id/annotate', {
    name: 'refAnnotate',
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

Router.route('/dicts', {
    name: 'dicts',
    waitOn: function () {
        return [Meteor.subscribe('allDicts'), Meteor.subscribe('exportUsers')];
    },
    data: function () {
        //var cursor = Dicts.find();
        return {
            dicts: Dicts.find()
        }
    }
});

Router.route('/dict/new', {
    name: 'dictnew',
    data: function () {
        return {
            diccionario: {dict: "", dictgroup: "", words: []}
        }
    }
});

Router.route('/dicts/:_id', {
    name: 'dict',
    waitOn: function () {
        return Meteor.subscribe('singleDict', this.params._id);
    },
    data: function () {
        return {
            dict: Dicts.findOne()
        }
    }
});

Router.route('/dicts/:_id/edit', {
    name: 'dictedit',
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

Router.route('/refsearch', {
    name: 'refsearch',
    waitOn: function () {
        var qry = this.params.query;
        Session.set('searchRefs', qry);
        var cqry = _.clone(qry);
        return [Meteor.subscribe("allDicts"), Meteor.subscribe("allRefsSearch", cleanRefQuery(cqry))];
    },
    data: function () {
        var cnt = Refs.find().count();
        return {
            count: cnt,
            yesfound: cnt > 0,
            toomuch: cnt >= 20,
            refsfound: Refs.find()
        }
    }
});

Router.route('/tipisearch', {
    name: 'tipisearch',
    waitOn: function () {
        var qry = this.params.query;
        Session.set('searchTipis', qry);
        var cqry = _.clone(qry);
        return [Meteor.subscribe("allDicts"), Meteor.subscribe("allTipisSearch", cleanTipiQuery(cqry))];
    },
    data: function () {
        var cnt = Tipis.find().count();
        return {
            count: cnt,
            yesfound: cnt > 0,
            toomuch: cnt >= 20,
            tipisfound: Tipis.find()
        }
    }
});

Router.route('/tipis/:_id', {
    name: 'tipiprivate',
    waitOn: function () {
        return Meteor.subscribe('singleTipiByManager', this.params._id);
    },
    data: function () {
        return {
            tipi: Tipis.findOne()
        }
    }
});

Router.route('/t/:_id', {
    name: 'tipipublic',
    waitOn: function () {
        return [
            Meteor.subscribe('singleTipi', this.params._id),
            Meteor.subscribe('diputados')
        ];
    },
    data: function () {
        return {
            tipi: Tipis.findOne()
        }
    }
});


// Router.route('/', { name: 'homepage' });
Router.route('que-es', { name: 'what' });
Router.route('quienes-somos', { name: 'who' });
Router.route('/login', { name: 'login' });
Router.route('/signup', { name: 'signup' });
Router.route('/forgot', { name: 'forgot' });
Router.route('/que-paso-con', { name: 'quepasocon' });

Router.route('/temas', {
    name: 'topics',
    waitOn: function () {
        return Meteor.subscribe("allTipiDictsWithDesc");
    },
    data: function () {
        return {
            dicts: Dicts.find()
        }
    }
});

Router.route('/temas/:slug', {
    name: 'topic',
    waitOn: function () {
        return [
            Meteor.subscribe('singleDictBySlug', this.params.slug),
            Meteor.subscribe('tipiStats'),
            Meteor.subscribe('diputados'),
            Meteor.subscribe('limitedTipiListByDict', this.params.slug)
        ];
    }
});

Router.route('/buscar/', {
    name: 'scannertext',
    waitOn: function () {
        var qry = this.params.query;
        Session.set('scannerText', qry);
        var cqry = _.clone(qry);
        return [Meteor.subscribe("allDicts"), Meteor.subscribe("allTipisSearch", cleanTipiQuery(cqry))];
    },
    data: function () {
        var cnt = Tipis.find().count();
        return {
            count: cnt,
            yesfound: cnt > 0,
            searched: _.keys(this.params.query).length > 0,
            tipisfound: Tipis.find({}, {sort: {fecha: -1}})
        }
    }
});

Router.route('/', {
    name: 'scannervizz',
    waitOn: function () {
        return [
            Meteor.subscribe('tipiStats'),
            Meteor.subscribe('allTipiDicts'),
            Meteor.subscribe('diputados')];
    },
    data: function () {
        return {}
    }
});

Router.route('/profiles', {
    name: 'profiles',
    waitOn: function() {
        return [
            Meteor.subscribe('listUsers'),
            Meteor.subscribe('diputados')
        ]
    }
});

Router.route('/profile/:username', {
    name: 'profile',
    waitOn: function () {
        return [
            Meteor.subscribe("userInfo", this.params.username)
        ];
    },
    data: function () {
        return {
            userobject: Meteor.users.findOne({username: this.params.username})
        }
    }
});

Router.route('/profile/:username/edit', {
    name: 'profile_edit',
    waitOn: function () {
        return Meteor.subscribe('allTipiDicts');
    }
});



// Permission functions

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

var youAre = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    if (Meteor.user().username == this.params.username) {
        this.next();
    } else {
        this.render('accessDenied');
    }
  }
}

var goToProfile = function() {
  if (Meteor.user()) {
    Router.go('/profile/' + Meteor.user().username);
  } else {
    this.next();
  }
};



// Router permissions

Router.onBeforeAction('dataNotFound', {only: ['postPage', 'profile']});
Router.onBeforeAction(requireLogin, {only: ['postSubmit', 'meetupnew']});
Router.onBeforeAction(goToProfile, {only: ['login', 'signup', 'forgot']});
Router.onBeforeAction(youAre, {only: 'profile_edit'});

// Clean old messages

Router.onBeforeAction(function() {
    Messages.remove({});
    this.next();
});

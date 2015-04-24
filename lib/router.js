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
    console.log(Posts.find({}).fetch());
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




/* Router.route functions */

Router.route('/forum/new/:postsLimit?', {name: 'newPosts'});
Router.route('/forum/best/:postsLimit?', {name: 'bestPosts'});

Router.route('/forum', {
    name: 'forum',
    controller: NewPostsController
});

Router.route('/forum/posts/:_id', {
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

Router.route('/forum/posts/:_id/edit', {
    name: 'postEdit',
    waitOn: function() { 
      return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() {
      return Posts.findOne(this.params._id);
    }
});

Router.route('/forum/submit'), {
    name: 'postSubmit'
}

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
        return Meteor.subscribe('allDicts');
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
        var oid = new Mongo.ObjectID(this.params._id);
        return Meteor.subscribe('singleDict', oid);
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
        var fdesde, fhasta, hayautor, tipoautor;
        fdesde = fhasta = null;
        hayautor = false;
        tipoautor = '';
        for (var k in cqry) {
            if( k == "fechadesde" && cqry[k] != "" ) {
                fdesde = cqry[k];
                delete cqry[k];
            } else if(k == "fechahasta" && cqry[k] != "") {
                fhasta = cqry[k];
                delete cqry[k];
            } else if (k == "autor") {
                hayautor = true;
            } else if (k == "tipoautor") {
                tipoautor = cqry[k];
                delete cqry[k];
            } else if (cqry[k] == "") {
                delete cqry[k];
            } else if (typeof(cqry[k]) != "object") {
                cqry[k] = {$regex: qry[k], $options: "gi"};
            }
        }
        if( fdesde != null && fhasta != null ) {
            cqry["fecha"] = {$gte: new Date(fdesde), $lte: new Date(fhasta)};
        }
        if (hayautor) {
            newautor = {};
            if (tipoautor == 'diputado') {
                newautor = { 'autor.diputado': {$regex: cqry['autor'], $options: "gi"} }
            } if (tipoautor == 'grupo') {
                newautor = { 'autor.grupo': {$regex: cqry['autor'], $options: "gi"} }
            } if (tipoautor == 'otro') {
                newautor = { 'autor.otro': {$regex: cqry['autor'], $options: "gi"} }
            } else {
                //
            }
            delete cqry['autor'];
            jQuery.extend(cqry, newautor);
        }
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

Router.route('/tipis', {
    name: 'tipilist',
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
        var cnt = Refs.find().count();
        return {
            count: cnt,
            yesfound: cnt > 0,
            toomuch: cnt > 100,
            tipisfound: Refs.find()
        }
    }
});

Router.route('/tipis/:_id', {
    name: 'tipiprivate',
    waitOn: function () {
        var oid = new Mongo.ObjectID(this.params._id);
        return Meteor.subscribe('singleTipi', oid);
    },
    data: function () {
        return {
            tipi: Refs.findOne()
        }
    }
});

Router.route('/tipis/:_id/edit', {
    name: 'tipiedit',
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
            tipiini: Refs.findOne()
        }
    }
});

Router.route('/t/:_id', {
    name: 'tipipublic',
    waitOn: function () {
        var oid = new Mongo.ObjectID(this.params._id);
        return Meteor.subscribe('singleTipi', oid);
    },
    data: function () {
        return {
            tipi: Refs.findOne()
        }
    }
});

Router.route('/', { name: 'homepage' });
Router.route('/about', { name: 'about' });
Router.route('/login', { name: 'login' });
Router.route('/signup', { name: 'signup' });
Router.route('/forgot', { name: 'forgot' });

Router.route('/scanner/vizz', {
    name: 'scannervizz',
    waitOn: function () {
        return [Meteor.subscribe("allTipiDicts"), Meteor.subscribe('allTipis')];
    },
    data: function () {
        return { }
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

// Router permissions

Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});

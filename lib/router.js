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

Router.route('/forum/add', {
    name: 'forumAdd',
    waitOn: function () {
        return Meteor.subscribe('allDicts');
    },
    data: function () {
        return {
            dicts: Dicts.find()
        }
    }
});

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
            cqry["fecha"] = {
                $gte: datestringToISODate(fdesde, true),
                $lte: datestringToISODate(fhasta, false)
            };
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
            cqry["fecha"] = {
                $gte: datestringToISODate(fdesde, true),
                $lte: datestringToISODate(fhasta, false)
            };
        }
        if (hayautor) {
            newautor = {};
            if (tipoautor == 'diputado') {
                newautor = { 'autor_diputado': {$regex: cqry['autor'], $options: "gi"} }
            } if (tipoautor == 'grupo') {
                newautor = { 'autor_grupo': {$regex: cqry['autor'], $options: "gi"} }
            } if (tipoautor == 'otro') {
                newautor = { 'autor_otro': {$regex: cqry['autor'], $options: "gi"} }
            } else {
                //
            }
            delete cqry['autor'];
            jQuery.extend(cqry, newautor);
        }
        return [Meteor.subscribe("allDicts"), Meteor.subscribe("allTipisSearch", cqry)];
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
        return Meteor.subscribe('singleTipi', this.params._id);
    },
    data: function () {
        return {
            tipi: Tipis.findOne()
        }
    }
});


Router.route('/meetups', {
    name: 'meetups',
    waitOn: function () {
        return Meteor.subscribe('allActiveMeetups');
    },
    data: function () {
        return {
            meetups: Meetups.find()
        }
    }
});

Router.route('/meetups/archive', {
    name: 'oldmeetups',
    waitOn: function () {
        return Meteor.subscribe('allOldMeetups');
    },
    data: function () {
        return {
            meetups: Meetups.find()
        }
    }
});

Router.route('/meetup/new', {
    name: 'meetupnew'
});

Router.route('/meetups/:_id', {
    name: 'meetup',
    waitOn: function () {
        var oid = new Mongo.ObjectID(this.params._id);
        return Meteor.subscribe('singleMeetup', oid);
    },
    data: function () {
        return {
            meetup: Meetups.findOne()
        }
    }
});

Router.route('/meetups/:_id/edit', {
    name: 'meetupedit',
    waitOn: function () {
        var oid = new Mongo.ObjectID(this.params._id);
        return Meteor.subscribe('singleMeetup', oid);
    },
    data: function () {
        return {
            meetup: Meetups.findOne()
        }
    }
});



Router.route('/', { name: 'homepage' });
Router.route('/about', { name: 'about' });
Router.route('/login', { name: 'login' });
Router.route('/signup', { name: 'signup' });
Router.route('/forgot', { name: 'forgot' });

Router.route('/participa', { name: 'participa' });

Router.route('/quepasocon', { name: 'quepasocon' });

Router.route('/topics', {
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

Router.route('/scanner/', {
    name: 'scannertext',
    waitOn: function () {
        var qry = this.params.query;
        Session.set('scannerText', qry);
        var cqry = _.clone(qry);
        var fdesde, fhasta, newautor, newgrupootro;
        fdesde = fhasta = null;
        newautor = newgrupootro = {};
        for (var k in cqry) {
            if( k == "fechadesde" && cqry[k] != "" ) {
                fdesde = cqry[k];
                delete cqry[k];
            } else if(k == "fechahasta" && cqry[k] != "") {
                fhasta = cqry[k];
                delete cqry[k];
            } else if ((k == "autor") && (cqry[k] != "")) {
                newautor = { 'autor_diputado': {$regex: cqry['autor'], $options: "gi"} }
                delete cqry['autor'];
            } else if ((k == "grupootro") && (cqry[k] != "")) {
                if (cqry['grupootro'] == 'Gobierno') {
                    newgrupootro = { 'autor_otro': cqry['grupootro'] }
                } else {
                    newgrupootro = { 'autor_grupo': cqry['grupootro'] }
                }
                delete cqry['grupootro'];
            } else if (cqry[k] == "") {
                delete cqry[k];
            } else if (typeof(cqry[k]) != "object") {
                cqry[k] = {$regex: qry[k], $options: "gi"};
            }
        }
        if (newautor != {}) {
            jQuery.extend(cqry, newautor);
        }
        if (newgrupootro != {}) {
            jQuery.extend(cqry, newgrupootro);
        }
        if( fdesde != null && fhasta != null ) {
            cqry["fecha"] = {
                $gte: datestringToISODate(fdesde, true),
                $lte: datestringToISODate(fhasta, false)
            };
        }
        return [Meteor.subscribe("allDicts"), Meteor.subscribe("allTipisSearch", cqry)];
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

Router.route('/scanner/vizz', {
    name: 'scannervizz',
    waitOn: function () {
        return [
            Meteor.subscribe('tipiStats'),
            /*Meteor.subscribe('tipiStatsByDeputies'),
            Meteor.subscribe('tipiStatsByGroups'),
            Meteor.subscribe('latestTipisByDicts'),*/
            Meteor.subscribe('allTipiDicts')];
    },
    data: function () {
        return {}
    }
});

Router.route('/profiles', {
    name: 'profiles',
    waitOn: function() {
        return Meteor.subscribe('listUsers');
    }
});

Router.route('/profile/:username', {
    name: 'profile',
    waitOn: function () {
        return [
            Meteor.subscribe("userInfo", this.params.username),
            Meteor.subscribe("userLatestPosts", this.params.username),
            Meteor.subscribe("userLatestComments", this.params.username)
        ];
    },
    data: function () {
        return {
            userobject: Meteor.users.findOne({username: this.params.username}),
            posts: Posts.find(),
            comments: Comments.find()
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

// Router permissions

Router.onBeforeAction('dataNotFound', {only: ['postPage', 'profile']});
Router.onBeforeAction(requireLogin, {only: ['postSubmit', 'meetupnew']});
Router.onBeforeAction(youAre, {only: 'profile_edit'});

// Clean old messages

Router.onBeforeAction(function() {
    Messages.remove({});
    this.next();
});

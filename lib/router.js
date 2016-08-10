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


/* Controllers */

Router.route('/', {
    name: 'home',
    waitOn: function() {
        return [
            Meteor.subscribe('tipiStats'),
            Meteor.subscribe('activeBanners')
        ]
    }
});

Router.route('que-es', { name: 'what' });
Router.route('quienes-somos', { name: 'who' });
Router.route('cookies', { name: 'cookies' });
Router.route('/que-paso-con', { name: 'quepasocon' });

Router.route('/buscar/', {
    name: 'search',
    waitOn: function () {
        var qry = this.params.query;
        Session.set('search', qry);
        var cqry = _.clone(qry);
        if (_.keys(qry).length > 0) {
            return [
                Meteor.subscribe("allDicts"),
                Meteor.subscribe("allDeputyNames"),
                Meteor.subscribe("allTipisSearch", cleanTipiQuery(cqry))
            ];
        } else {
            return [
                Meteor.subscribe("allDicts"),
                Meteor.subscribe("allDeputyNames")
            ];
        }
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

Router.route('/scanner', {
    name: 'scanner',
    waitOn: function () {
        return [
            Meteor.subscribe('tipiStats'),
            Meteor.subscribe('allTipiDicts'),
            Meteor.subscribe('allDeputies')];
    }
});

Router.route('/tipis/:_id', {
    name: 'tipi',
    waitOn: function () {
        return [
            Meteor.subscribe('singleTipi', this.params._id),
            Meteor.subscribe('allDeputies')
        ];
    },
    data: function () {
        return {
            tipi: Tipis.findOne()
        }
    }
});

Router.route('/temas', {
    name: 'dicts',
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
    name: 'dict',
    waitOn: function () {
        return [
            Meteor.subscribe('singleDictBySlug', this.params.slug),
            Meteor.subscribe('tipiStats'),
            Meteor.subscribe('allDeputies'),
            Meteor.subscribe('limitedTipiListByDict', this.params.slug)
        ];
    }
});

Router.route('/dip/:_id', {
    name: 'deputy',
    waitOn: function () {
        return [
            Meteor.subscribe('singleDeputyById', generateId(this.params._id)),
            Meteor.subscribe('limitedTipiListByDeputy', generateId(this.params._id))
        ];
    },
    data: function() {
        dip = Diputados.find().fetch();
        if (dip) {
            dip = dip[0];
        } else {
            dip = null;
        }
        return {
            deputy: dip,
            tipis: Tipis.find()
        }
    }
});

Router.route('/grupo/:_id', {
    name: 'group',
    waitOn: function () {
        return [
            Meteor.subscribe('singleGroupById', generateId(this.params._id)),
            Meteor.subscribe('limitedTipiListByGroup', generateId(this.params._id))
        ];
    },
    data: function() {
        group = Grupos.find().fetch();
        if (group) {
            group = group[0];
        } else {
            group = null;
        }
        return {
            group: group,
            tipis: Tipis.find()
        }
    }
});


Router.route('/login', { name: 'login' });
Router.route('/signup', { name: 'signup' });
Router.route('/forgot', { name: 'forgot' });

Router.route('/perfil', {
    name: 'profile',
    data: function () {
        return {
            userobject: Meteor.user()
        }
    }
});

Router.route('/perfil/editar', {
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

var goToProfile = function() {
  if (Meteor.user()) {
    Router.go('profile');
  } else {
    this.next();
  }
};


// Router permissions

Router.onBeforeAction(requireLogin, {only: ['profile', 'profile_edit']});
Router.onBeforeAction(goToProfile, {only: ['login', 'signup', 'forgot']});


// Clean old messages

Router.onBeforeAction(function() {
    Messages.remove({});
    this.next();
});

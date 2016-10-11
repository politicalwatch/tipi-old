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

function setTitle(subtitle) {
    document.title = subtitle + " | TiPi: Transparencia, Información, Participación, Incidencia";
}

/* Controllers */

Router.route('/', {
    name: 'home',
    waitOn: function() {
        array_subs = [
            Meteor.subscribe('tipiStats'),
            Meteor.subscribe('activeBanners'),
            Meteor.subscribe('basicTipiDicts'),
            Meteor.subscribe('allSlugsInTipiDicts'),
            Meteor.subscribe('allDeputyNames')
        ]
        if (!Session.get('total-initiatives')) {
            array_subs.push(Meteor.subscribe('basicInitiatives'));
        }
        return array_subs;
    },
    data: function() {
        return {
            title: ''
        }
    }
});

Router.route('estadisticas', {
    name: 'stats',
    title: 'Las estadísticas',
    waitOn: function() {
        array_subs = [
            Meteor.subscribe('tipiStats'),
            Meteor.subscribe('basicTipiDicts')
        ]
        if (!Session.get('total-initiatives')) {
            array_subs.push(Meteor.subscribe('basicInitiatives'));
        }
        return array_subs;
    },
    data: function() {
        return {
            title: 'Las estadísticas'
        }
    }
});

Router.route('api-doc', { 
    name: 'apidoc',
    title: 'Documentación de nuestra API',
    waitOn:function() {
        return Meteor.subscribe('allSlugsInTipiDicts');

    },
    data: function () {
        return {
            title: 'Documentación de la API',
            dicts: Dicts.find(),
        }
    }
});


Router.route('acerca', {
    name: 'about',
    title: 'Acerca de TIPI',
    data: function() {
        return {
            title: 'Acerca de TIPI'
        }
    }
});

Router.route('cookies', { 
    name: 'cookies',
    title: 'Cookies',
    data: function() {
        return {
            title: 'Cookies'
        }
    }
});
Router.route('/que-paso-con', {
    name: 'quepasocon',
    title: 'Qué paso con...',
    data: function() {
        return {
            title: 'Qué paso con...'
        }
    }
});

Router.route('/escaner/', {
    name: 'search',
    title: 'Escáner',
    waitOn: function () {
        var qry = this.params.query;
        Session.set('search', qry);
        var cqry = _.clone(qry);
        if (_.keys(qry).length > 0) {
            subs = [
                Meteor.subscribe("allTipiDictsWithTerms"),
                Meteor.subscribe("allDeputyNames"),
                Meteor.subscribe("allTipisSearch", cleanTipiQuery(cqry))
            ];
        } else {
            return [
                Meteor.subscribe("allTipiDictsWithTerms"),
                Meteor.subscribe("allDeputyNames")
            ];
        }
    },
    data: function () {
        var cnt = Iniciativas.find().count();
        return {
            title: 'Escáner',
            count: cnt,
            yesfound: cnt > 0,
            searched: _.keys(this.params.query).length > 0,
            tipisfound: Iniciativas.find({}, {sort: {fecha: -1}})
        }
    }
});

Router.route('/tipis/:_id', {
    name: 'tipi',
    title: '', //It will be assigned into view
    waitOn: function () {
        return [
            Meteor.subscribe('singleTipi', generateId(this.params._id)),
            Meteor.subscribe('relatedTipis', generateId(this.params._id)),
            Meteor.subscribe('allDeputies'),
            Meteor.subscribe('allGroups')
        ];
    },
    data: function () {
        var id = this.params._id;
        return {
            title: 'Iniciativa',
            tipi: Iniciativas.findOne({"_id": generateId(id)}),
            related: _.toArray(_.filter(Iniciativas.find().fetch(), function(obj) { return obj._id._str !== id; }))
        }
    }
});

Router.route('/temas', {
    name: 'dicts',
    title: 'Temas',
    waitOn: function () {
        return Meteor.subscribe("allTipiDictsWithDesc");
    },
    data: function () {
        return {
            title: 'Temas',
            dicts: Dicts.find()
        }
    }
});

Router.route('/temas/:slug', {
    name: 'dict',
    title: '', //It will be assigned into view
    waitOn: function () {
        subs = [
            Meteor.subscribe('singleTipiDictBySlug', this.params.slug),
            Meteor.subscribe('tipiStats'),
            Meteor.subscribe('allDeputies'),
            Meteor.subscribe('allGroups')
        ];
        if (Roles.userIsInRole(Meteor.user(), ["admin"])) {
            subs.push(Meteor.subscribe('exportUsers'));
        } 
        return subs;
    },
    data: function() {
        return {
            title: 'Tema',
            dict: Dicts.findOne()
        }
    }
});

Router.route('/dip/:_id', {
    name: 'deputy',
    title: '', //It will be assigned into view
    waitOn: function () {
        return [
            Meteor.subscribe('singleDeputyById', generateId(this.params._id)),
            Meteor.subscribe('limitedTipiListByDeputy', generateId(this.params._id)),
            Meteor.subscribe('allGroups')
        ];
    },
    data: function() {
        return {
            title: 'Diputado/a',
            deputy: Diputados.findOne(),
            tipis: Iniciativas.find()
        }
    }
});

Router.route('/grupo/:_id', {
    name: 'group',
    title: '', //It will be assigned into view
    waitOn: function () {
        return [
            Meteor.subscribe('singleGroupById', generateId(this.params._id)),
            Meteor.subscribe('limitedTipiListByGroup', generateId(this.params._id))
        ];
    },
    data: function() {
        return {
            title: 'Grupo Parlamentario',
            group: Grupos.findOne(),
            tipis: Iniciativas.find()
        }
    }
});


Router.route('/login', {
    name: 'login',
    title: 'Acceso',
    data: function() {
        return {
            title: 'Acceso'
        }
    }
});

Router.route('/signup', {
    name: 'signup',
    title: 'Registro',
    data: function() {
        return {
            title: 'Registro'
        }
    }
});

Router.route('/forgot', {
    name: 'forgot',
    title: '¿Olvidó su contraseña?',
    data: function() {
        return {
            title: '¿Olvidó su contraseña?'
        }
    }
});

Router.route('/perfil', {
    name: 'profile',
    template: 'profile_edit',
    title: 'Tu perfil',
    waitOn: function () {
        return Meteor.subscribe('allTipiDicts');
    },
    data: function() {
        return {
            title: 'Tu perfil'
        }
    }
});

Router.route('faq', { 
    name: 'faq',
    title: 'FAQ',
    data: function() {
        return {
            title: 'FAQ'
        }
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

Router.after(function() {
    title = 'TiPi: Transparencia, Información, Participación, Incidencia';
    if (this.route.options.title)
        title = this.route.options.title + ' | ' + title;
    document.title = title;
});

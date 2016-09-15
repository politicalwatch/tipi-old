/* ---------------------------------------------------- +/

## Tipi ##

Code related to the tipi template

/+ ---------------------------------------------------- */

Template.tipi.onCreated(function() {
    $('.page-title h1').html(Tipis.findOne().titulo);
});

Template.tipi.helpers({
    searchUrl: function() {
        return Session.get('searchUrl') || Router.path('search');
    },
    emptySearch: function() {
        if (Session.get('searchUrl')) return false
        else return true
    },
    hasAutor: function() {
        return !_.isEmpty(this.autor_otro) || !_.isEmpty(this.autor_diputado);
    },
    getAutor: function() {
        if (!_.isEmpty(this.autor_otro)) {
            return this.autor_otro;
        } else {
            return this.autor_diputado;
        }
    },
    groupsHumanized: function() {
        groups = [];
        for(i=0;i<this.autor_grupo.length;i++) {
            groups.push(parliamentarygroups[this.autor_grupo[i]]);
        }
        return groups;
    },
    colorizedGroup: function(val) {
        return parliamentarygroups_colors[val];
    },
    fotoDip: function(val) {
        dip = Diputados.findOne({nombre: val});
        if (dip) {
            return dip.imagen;
        } else {
            return "";
        }
    },
    hasRelated: function() {
        return this.related.length > 0;
    },
    qpcClass: function() {
        if (this.quepasocon.toLowerCase() == 'cumplido') {
            return 'complete';
        } else if (this.quepasocon.toLowerCase() == 'no cumplido') {
            return 'uncomplete';
        } else if (this.quepasocon.toLowerCase() == 'parcialmente cumplido') {
            return 'partially';
        } else {
            return 'pending';
        }
    },
    qpcIcon: function() {
        if (this.quepasocon.toLowerCase() == 'cumplido') {
            return 'check-circle';
        } else if (this.quepasocon.toLowerCase() == 'no cumplido') {
            return 'minus-circle';
        } else if (this.quepasocon.toLowerCase() == 'parcialmente cumplido') {
            return 'adjust';
        } else {
            return 'clock-o';
        }
    }
});

Template.tipi.events({
    // 'click #toogle-content': function(e) {
    //     e.preventDefault();
    //     if ($('#content-block').hasClass('hide')) {
    //         $('#toogle-content').html('<i class="fa fa-angle-double-up"></i> Ocultar contenido <i class="fa fa-angle-double-up"></i>');
    //         $('#content-block').removeClass('hide');
    //     } else {
    //         $('#toogle-content').html('<i class="fa fa-angle-double-down"></i> Mostrar contenido <i class="fa fa-angle-double-down"></i>');
    //         $('#content-block').addClass('hide');
    //     }
    // },
    'click #back': function(e) {
        e.preventDefault();
        history.back();
    },
});

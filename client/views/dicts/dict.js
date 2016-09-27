Template.dict.rendered = function() {
    name = Dicts.findOne().name.capitalize();
    $('.page-title h1').html(name);
    document.title = name + ' | ' + document.title;
}

Template.dict.helpers({
    dict: function() {
        dict_array = Dicts.find().fetch();
        return dict_array[0].name;
    },
    showDate: function(fecha) {
        return moment(this.fecha).format('l');
    },
    fotoDip: function(val) {
        dip = Diputados.findOne({nombre: val});
        if (dip) {
            return dip.imagen;
        } else {
            return "";
        }
    },
    getDipId: function(val) {
        dip = Diputados.findOne({nombre: val});
        if (dip) {
            return dip._id._str;
        } else {
            return "";
        }
    },
    getGroupId: function(val) {
        g = Grupos.findOne({nombre: val});
        if (g) {
            return g._id._str;
        } else {
            return "";
        }
    },
    deputies: function() {
        dict_array = Dicts.find().fetch();
        d_array = TipiStats.find({}, {fields: {'bydeputies._id': 1, 'bydeputies.deputies': 1}}).fetch();
        result = _.filter(d_array[0].bydeputies, function(d) { return d._id == dict_array[0].name; });
        return result[0].deputies;
    },
    groups: function() {
        dict_array = Dicts.find().fetch();
        g_array = TipiStats.find({}, {fields: {'bygroups._id': 1, 'bygroups.groups': 1}}).fetch();
        result = _.filter(g_array[0].bygroups, function(g) { return g._id == dict_array[0].name; });
        return result[0].groups;
    },
    latest: function() {
        dict_array = Dicts.find().fetch();
        l_array = TipiStats.find({}, {fields: {'latest._id': 1, 'latest.items': 1}, sort: {'latest.fecha': -1}}).fetch();
        result = _.filter(l_array[0].latest, function(l) { return l._id == dict_array[0].name; });
        return result[0].items.sort(function (a, b) {
            if (a.fecha < b.fecha) return -1;
            if (b.fecha < a.fecha) return 1;
            return 0;
        });
    },
    getName: function() {
        return this.dict.name;
    },
    getDescription: function() {
        return this.dict.description;
    },
    getIcon: function() {
        return this.dict.iconb1;
    },
    getTerms: function() {
        return _.pluck(this.dict.terms, 'humanterm');
    },
    shareData: function() {
        str = "Consulta lo último sobre " + this.dict.name + " en";
        return {title: str, author: Meteor.settings.public.twitter_account, url: window.location.href}
    }
});

Template.topic.helpers({
    dict: function() {
        dict_array = Dicts.find().fetch();
        return dict_array[0].dict;
    },
    relativeDate: function(fecha) {
        return moment(fecha).startOf('day').fromNow();
    },
    fotoDip: function(val) {
        dip = Diputados.findOne({nombre: val});
        if (dip) {
            return dip.imagen;
        } else {
            return "";
        }
    },
    groupsHumanized: function(val) {
        return parliamentarygroups[val];
    },
    colorizedGroup: function(val) {
        return parliamentarygroups_colors[val];
    },
    deputies: function() {
        dict_array = Dicts.find().fetch();
        d_array = TipiStats.find({}, {fields: {'bydeputies._id': 1, 'bydeputies.deputies': 1}}).fetch();
        result = _.filter(d_array[0].bydeputies, function(d) { return d._id == dict_array[0].dict; });
        return result[0].deputies;
    },
    groups: function() {
        dict_array = Dicts.find().fetch();
        g_array = TipiStats.find({}, {fields: {'bygroups._id': 1, 'bygroups.groups': 1}}).fetch();
        result = _.filter(g_array[0].bygroups, function(g) { return g._id == dict_array[0].dict; });
        return result[0].groups;
    },
    latest: function() {
        dict_array = Dicts.find().fetch();
        l_array = TipiStats.find({}, {fields: {'latest._id': 1, 'latest.items': 1}}).fetch();
        result = _.filter(l_array[0].latest, function(l) { return l._id == dict_array[0].dict; });
        return result[0].items.sort(function (a, b) {
            if (a.fecha < b.fecha) return -1;
            if (b.fecha < a.fecha) return 1;
            return 0;
        });
    },
    initiatives: function() {
      return Tipis.find();
    }
});

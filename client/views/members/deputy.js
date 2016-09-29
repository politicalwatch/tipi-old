
function getSharedDipName(name, twitter) {
    if (twitter) {
        return "@"+twitter.split('/')[3];
    } else {
        return name;
    }
}

Template.deputy.rendered = function() {
    id = generateId(window.location.pathname.split("/")[2]);
    name = Diputados.findOne({_id: id}).nombre.capitalize();
    $('.page-title h1').html(name);
    document.title = name + ' | ' + document.title;
};

Template.deputy.helpers({
    group: function() {
        return parliamentarygroups[this.deputy.grupo];
    },
    hasTipis: function() {
        return Iniciativas.find().count() > 0;
    },
    parseTitle: function(t) {
        return cutTitle(t);
    },
    showDate: function(fecha) {
        return moment(this.fecha).format('l');
    },
    getGroupId: function(val) {
        g = Grupos.findOne({nombre: val});
        if (g) {
            return g._id._str;
        } else {
            return "";
        }
    },
    shareData: function() {
        str = "Consulta la ficha de " + getSharedDipName(this.deputy.nombre, this.deputy.twitter) + " en";
        return {title: str, author: Meteor.settings.public.twitter_account, url: window.location.href}
    }
});

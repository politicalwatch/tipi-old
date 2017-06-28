
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
    document.title = name + ' | ' + document.title;
};

Template.deputy.helpers({
    group: function() {
        return Grupos.findOne({acronimo: this.deputy.grupo}).nombre;
    },
    hasTipis: function() {
        return Iniciativas.find().count() > 0;
    },
    showDate: function(date) {
        return moment(date).format('l');
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
        str = "Información parlamentaria de " + getSharedDipName(this.deputy.nombre, this.deputy.twitter);
        return {title: str, author: Meteor.settings.public.twitter_account, url: window.location.href, description: "Infórmate sobre la actividad parlamentaria de " + getSharedDipName(this.deputy.nombre, this.deputy.twitter) + " (últimas iniciativas, e-mail, cuenta de Twitter, etc)."}
    }
});

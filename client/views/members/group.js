Template.group.rendered = function() {
    id = generateId(window.location.pathname.split("/")[2]);
    name = Grupos.findOne({_id: id}).nombre.capitalize();
    document.title = name + ' | ' + document.title;
}

Template.group.helpers({
    hasTipis: function() {
        return Iniciativas.find().count() > 0;
    },
    showDate: function(date) {
        return moment(date).format('l');
    },
    shareData: function() {
        str = "Actividad parlamentaria del " + this.group.nombre;
        return {title: str, author: Meteor.settings.public.twitter_account, url: window.location.href, description: "Accede a las últimas iniciativas parlamentarias del " + this.group.nombre + " sobre las 21 temáticas TiPi."}
    }
});

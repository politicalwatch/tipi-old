Template.group.onCreated(function() {
    name = Grupos.findOne().nombre.capitalize();
    $('.page-title h1').html(name);
    document.title = name + ' | ' + document.title;
});

Template.group.helpers({
    hasTipis: function() {
        return Iniciativas.find().count() > 0;
    },
    showDate: function(fecha) {
        return moment(this.fecha).format('l');
    },
    shareData: function() {
        str = "Consulta la ficha de " + this.group.nombre + " en";
        return {title: str, author: Meteor.settings.public.twitter_account, url: window.location.href}
    }
});

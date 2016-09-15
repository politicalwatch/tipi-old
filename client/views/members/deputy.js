Template.deputy.onCreated(function() {
    name = Diputados.findOne().name.capitalize();
    $('.page-title h1').html(name);
    document.title = name + ' | ' + document.title;
});

Template.deputy.helpers({
    group: function() {
        return parliamentarygroups[this.deputy.grupo];
    },
    hasTipis: function() {
        return Tipis.find().count() > 0;
    }
});

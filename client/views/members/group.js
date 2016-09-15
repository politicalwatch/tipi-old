Template.group.onCreated(function() {
    name = Grupos.findOne().name.capitalize();
    $('.page-title h1').html(name);
    document.title = name + ' | ' + document.title;
});

Template.group.helpers({
    hasTipis: function() {
        return Tipis.find().count() > 0;
    }
});

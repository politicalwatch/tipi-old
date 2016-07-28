Template.group.helpers({
    hasTipis: function() {
        return Tipis.find().count() > 0;
    }
});

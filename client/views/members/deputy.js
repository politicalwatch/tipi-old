Template.deputy.helpers({
    group: function() {
        return parliamentarygroups[this.deputy.grupo];
    },
    hasTipis: function() {
        return Tipis.find().count() > 0;
    }
});

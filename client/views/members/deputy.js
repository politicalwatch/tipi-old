Template.deputy.helpers({
    group: function() {
        return parliamentarygroups[this.deputy.grupo];
    },
    initiatives: function() {
      return Tipis.find();
    },
    hasInitiatives: function() {
        return Tipis.find().count() > 0;
    }
});

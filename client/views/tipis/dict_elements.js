Template.dict_elements.helpers({
    getTerms: function(terms, dictname) {
        return _.pluck(_.where(terms, {dict: dictname}), 'humanterm');
    }
});

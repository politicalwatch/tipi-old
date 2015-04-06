Template.refAnnotate.ds = [];
Template.refAnnotate.ts = [];

Template.refAnnotate.created = function() {
    if (Refs.find().fetch()[0].annotate == false) {
        // suggest_annotation();
    }
}

Template.refAnnotate.helpers({
    show_terms: function() {
        return Refs.find().fetch()[0].terms;
    },
    show_dicts: function() {
        return Refs.find().fetch()[0].dicts;
    },
    // dictionaries_suggested: function() {
    //     if (typeof ds === 'undefined') return [];
    //     else return ds;
    // }
});

Template.refAnnotate.events({
    'click #back': function(e) {
        e.preventDefault();
        history.back();
    },
    'click #annotate': function(e) {
        e.preventDefault();
        console.log("Anotando...");
        $("#save").text("Anotando...");
        res = suggest_annotation();
        Meteor.call('annotateRef', this._id, res[0], res[1], true);
        console.log(res[0]);
        $("#save").text("Anotado!");
        console.log("Anotado!");
    },
});

/*
    This function gets Refs element annotation
    It returns dicts array
    It saves automatically dict terms
*/
function suggest_annotation() {
    ds = [];
    ts = [];
    dicts = Dicts.find().fetch();
    _.each(dicts, function(d) {
        if (d.dictgroup == "tipi") {
            _.each(d.words, function(w) {
                search = new RegExp(w, 'i');
                if (Refs.find({'content': search}).count() > 0) {
                    ts.push(w);
                    ds.push(d.dict);
                }
            });
        }
    });
    ds = ds.filter(onlyUnique)
    return [ds, ts];
}


/* Tools */

function onlyUnique (value, index, self) { 
    return self.indexOf(value) === index;
}
Template.eventedit.helpers({
	wordlist: function() {
		return this.words.sort().join("\n");
	}
});

Template.eventedit.rendered = function () {
  //
};

Template.eventedit.events({
	'click #submit': function(e,a) {
		console.log(this);
		e.preventDefault();
		console.log("Edit dict submitted");
		var words = $("#words").val();
		var wordsa = words.split("\n").sort();
		//var oid = new Mongo.ObjectID(this._id);
		console.log("here");
		Dicts.update({_id: this._id}, {$set: {dict: this.dict, dictgroup: this.dictgroup, description: this.description,
									words: wordsa, lastUpdate: new Date(), updatedBy: Meteor.user().username}})
	},
	'click #delete': function(e) {
		console.log("Remove dict submitted");
		console.log(this);
		e.preventDefault();
		Meteor.call("removeDict", {_id: this._id}, function(err, res) {
	    	Router.go('/dicts/');
			flash('Diccionario eliminado.', 'info');
		});
	},
	'click button.reset': function(e) {}
  //
});
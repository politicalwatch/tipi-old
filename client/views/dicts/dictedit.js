/* ---------------------------------------------------- +/

## Items ##

Code related to the items template

/+ ---------------------------------------------------- */

Template.dictedit.helpers({
	wordlist: function() {
		return this.words.sort().join("\n");
	}
});


//http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas?_piref73_12412194_73_1335437_1335437.next_page=/wc/servidorCGI&CMD=VERLST&BASE=IW10&FMT=INITXDSS.fmt&DOCS=1-1&DOCORDER=FIFO&OPDEF=ADJ&QUERY=%28181%2F002079*.NDOC.%29


Template.dictedit.rendered = function () {
  //
};

Template.dictedit.events({
	'click #submit': function(e,a) {
		console.log(this);
		e.preventDefault();
		console.log("Edit dict submitted");
		var words = $("#words").val();
		var wordsa = words.split("\n").sort();
		//var oid = new Mongo.ObjectID(this._id);
		console.log("here");
		Dicts.update({_id: this._id}, {$set: {dict: this.dict, dictgroup: this.dictgroup, 
									words: wordsa, lastUpdate: new Date(), updatedBy: Meteor.user().username}})
	},
	'click #delete': function(e) {
		console.log("Remove dict submitted");
		console.log(this);
		e.preventDefault();
		Meteor.call("removeDict", {_id: this._id}, function(err, res) {
    	Router.go('/dicts/');
			flash('Diccionario eliminado.');
		});
	},
	'click button.reset': function(e) {}
  //
});
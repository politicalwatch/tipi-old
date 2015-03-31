/* ---------------------------------------------------- +/

## Items ##

Code related to the items template

/+ ---------------------------------------------------- */

Template.tipiedit2.helpers({
	wordlist: function() {
		return this.words.sort().join("\n");
	}
});


//http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas?_piref73_12412194_73_1335437_1335437.next_page=/wc/servidorCGI&CMD=VERLST&BASE=IW10&FMT=INITXDSS.fmt&DOCS=1-1&DOCORDER=FIFO&OPDEF=ADJ&QUERY=%28181%2F002079*.NDOC.%29


Template.tipiedit2.rendered = function () {
  //
};

Template.tipiedit2.events({
	'click #submit': function(e,a) {
		console.log(this);
		e.preventDefault();
		console.log("Edit dict submitted");
		var words = $("#words").val();
		var wordsa = words.split("\n").sort();
		//var oid = new Mongo.ObjectID(this._id);
		console.log("here");
		Dicts.update({_id: this._id}, {$set: {dict: this.dict, dictgroup: this.dictgroup, 
									words: wordsa, lastUpdate: new Date()}})
	},
	'click button.reset': function(e) {}
  //
});
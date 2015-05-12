Template.dictnew.helpers({
	wordlist: function() {
		//return this.words.sort().join("\n");
		return "";
	}
});


//http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas?_piref73_12412194_73_1335437_1335437.next_page=/wc/servidorCGI&CMD=VERLST&BASE=IW10&FMT=INITXDSS.fmt&DOCS=1-1&DOCORDER=FIFO&OPDEF=ADJ&QUERY=%28181%2F002079*.NDOC.%29


Template.dictnew.rendered = function () {
  //
};


Template.dictnew.events({
	'click #create': function(e) {
		e.preventDefault();
		console.log("Create dict submitted");
		console.log(this);
		var words = $("#words").val();
		var wordsa = words.split("\n").sort();
		var dict  = $("#dict").val();
		var description = $("#description").val();
		var dictgroup = $("#dictgroup").val();
		var date = new Date();
		var newdict = {dict: dict, dictgroup: dictgroup, description: description, 
									words: wordsa,
									createdAt: date, lastUpdate: date, 
									updatedBy: Meteor.user().username,
									createdBy: Meteor.user().username};
		console.log(newdict);
		// TODO Limpiar espacios al principio y al final
		Meteor.call('createDict', newdict, function(error, result){
      		flash('Diccionario añadido.', 'info');
      		Router.go('/dicts');
    	});
	},
	'click button.reset': function(e) {}
  //
});

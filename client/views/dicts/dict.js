/* ---------------------------------------------------- +/

## Item ##

Code related to the item template

/+ ---------------------------------------------------- */

Template.dict.created = function () {
  //
};

Template.dict.helpers({
  
  myHelper: function () {
    //
  }

});

Template.dict.rendered = function () {
  //
};

Template.dict.events({

  'click #verencongreso': function(e, instance){
    var ref = this;
		e.preventDefault();
		window.open('http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas?_piref73_12412194_73_1335437_1335437.next_page=/wc/servidorCGI&CMD=VERLST&BASE=IW10&FMT=INITXDSS.fmt&DOCS=1-1&DOCORDER=FIFO&OPDEF=ADJ&QUERY=%28' + encodeURIComponent(this.ref) + '*.NDOC.%29');
    
		/*
    Meteor.call('removeItem', item, function(error, result){
    	alert('Item deleted.');
      Router.go('/items');
    });
		*/
  },
	'click #editardict': function(e, instance){
		var item = this;
		e.preventDefault();
		alert("Ruta a editar");
		console.log(this);
	},
	'click #borrardict': function(e, instance){
		var item = this;
		e.preventDefault();
		alert("Ruta a borrar");
		console.log(this);
	},
	'click #back': function(e) {
		e.preventDefault();
		history.back();
	}


});
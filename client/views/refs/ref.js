/* ---------------------------------------------------- +/

## Item ##

Code related to the item template

/+ ---------------------------------------------------- */

Template.ref.created = function () {
  //
};

Template.ref.helpers({
  
  myHelper: function () {
    //
  }

});

Template.ref.rendered = function () {
  //
};

Template.ref.events({

  'click #verencongreso': function(e, instance){
		e.preventDefault();
		//alert("Editar item");
		console.log("Esto", this);
		var url = 'http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas?_piref73_2148295_73_1335437_1335437.next_page=/wc/servidorCGI&CMD=VERLST&BASE=IW10&PIECE=IWD0&FMT=INITXD1S.fmt&FORM1=INITXLUS.fmt&DOCS=1-1&QUERY=%28I%29.ACIN1.+%26+%28' + encodeURIComponent(this.ref) + '%29.ALL.';
		console.log(url);
		window.open('http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas?_piref73_2148295_73_1335437_1335437.next_page=/wc/servidorCGI&CMD=VERLST&BASE=IW10&PIECE=IWD0&FMT=INITXD1S.fmt&FORM1=INITXLUS.fmt&DOCS=1-1&QUERY=%28I%29.ACIN1.+%26+%28' + encodeURIComponent(this.ref) + '%29.ALL.');
    
		/*
    Meteor.call('removeItem', item, function(error, result){
    	alert('Item deleted.');
      Router.go('/items');
    });
		*/
  },
	'click #seguirentipi': function(e, instance){
		var item = this;
		e.preventDefault();
		alert("Enviar referencia a TiPi");
		console.log(this);
	},
	'click #back': function(e) {
		e.preventDefault();
		history.back();
	}


});
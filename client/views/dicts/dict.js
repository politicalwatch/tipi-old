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
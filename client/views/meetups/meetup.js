Template.event.created = function () {
    //
};

Template.event.helpers({
    //
});

Template.event.rendered = function () {
  //
};

Template.event.events({
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
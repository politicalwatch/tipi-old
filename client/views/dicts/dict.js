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
	'click #back': function(e) {
		e.preventDefault();
		history.back();
	}
});
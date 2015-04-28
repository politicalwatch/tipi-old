/* ---------------------------------------------------- +/

## Public Tipi ##

Code related to the public tipi template

/+ ---------------------------------------------------- */

Template.tipipublic.created = function () {
  //
};

Template.tipipublic.helpers({
    // parseContentToHTML: function() {
    //     return Spacebars.SafeString(this.content.join("<br/>"));
    // }
});

Template.tipipublic.events({
    // 'click #toogle-content': function(e) {
    //     e.preventDefault();
    //     if ($('#content-block').hasClass('hide')) {
    //         $('#toogle-content').html('<i class="fa fa-angle-double-up"></i> Ocultar contenido <i class="fa fa-angle-double-up"></i>');
    //         $('#content-block').removeClass('hide');
    //     } else {
    //         $('#toogle-content').html('<i class="fa fa-angle-double-down"></i> Mostrar contenido <i class="fa fa-angle-double-down"></i>');
    //         $('#content-block').addClass('hide');
    //     }
    // },
    'click #back': function(e) {
		e.preventDefault();
		history.back();
	}


});
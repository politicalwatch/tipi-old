Template.faq.events({
  'click .opened': function(e) {
    //close all questions
    $(e.currentTarget).children('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');
    $(e.currentTarget).removeClass('opened').addClass('closed');
    $(e.currentTarget).parent().next('.question-text').height('0');
    /*$(e.currentTarget);
    $('.question-text').height('auto');
    $('.question-title a').removeClass('closed').addClass('opened');
    $('.question-title a .icon').removeClass('icon-angle-right').addClass('icon-angle-down');*/
  },
  'click .closed': function(e) {
    //close all questions
    $(e.currentTarget).children('.fa').removeClass('fa-angle-down').addClass('fa-angle-up');
    $(e.currentTarget).removeClass('closed').addClass('opened');
    $(e.currentTarget).parent().next('.question-text').height('auto');
  }
  //open clicked question
});

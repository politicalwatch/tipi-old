/* ---------------------------------------------------- +/

## Item ##

Code related to the item template

/+ ---------------------------------------------------- */

Template.ref.rendered = function () {
  //
};

Template.ref.helpers({
    contentHighlighted: function() {
        str = this.content.join("<br/>");
        if (this.terms !== 'undefined') {
            for(i=0;i<this.terms.length;i++) {
                regex = new RegExp(this.terms[i], "i");
                str = str.replace(regex, ("<span class='highlighted'>" + "$&" + "</span>") );
            }
        }
        return new Handlebars.SafeString(str);
    }
});

Template.ref.events({
  'click #verencongreso': function(e, instance){
	e.preventDefault();
	var url = 'http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas?_piref73_2148295_73_1335437_1335437.next_page=/wc/servidorCGI&CMD=VERLST&BASE=IW10&PIECE=IWD0&FMT=INITXD1S.fmt&FORM1=INITXLUS.fmt&DOCS=1-1&QUERY=%28I%29.ACIN1.+%26+%28' + encodeURIComponent(this.ref) + '%29.ALL.';
	window.open('http://www.congreso.es/portal/page/portal/Congreso/Congreso/Iniciativas?_piref73_2148295_73_1335437_1335437.next_page=/wc/servidorCGI&CMD=VERLST&BASE=IW10&PIECE=IWD0&FMT=INITXD1S.fmt&FORM1=INITXLUS.fmt&DOCS=1-1&QUERY=%28I%29.ACIN1.+%26+%28' + encodeURIComponent(this.ref) + '%29.ALL.');
  },
  'click #back': function(e) {
    e.preventDefault();
	history.back();
  }
});
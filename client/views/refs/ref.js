/* ---------------------------------------------------- +/

## Item ##

Code related to the item template

/+ ---------------------------------------------------- */

Template.ref.rendered = function () {
  //
};

Template.ref.helpers({
    getAutor: function() {
        if (typeof this.autor !== 'undefined') {
            if (typeof this.autor.grupo !== 'undefined') {return this.autor.grupo;}
            else if (typeof this.autor.diputado !== 'undefined') {return this.autor.diputado;}
            else if (typeof this.autor.otro !== 'undefined') {return this.autor.otro;}
            else {return '';}
        }
    },
    getGrupo: function() {
        if (typeof this.autor !== 'undefined') {
            if (typeof this.autor.grupo !== 'undefined') {return this.autor.grupo;}
            else {return '';}
        }
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
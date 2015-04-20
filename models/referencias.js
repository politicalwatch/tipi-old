/* ---------------------------------------------------- +/

## Items ##

All code related to the Items collection goes here. 

/+ ---------------------------------------------------- */

Refs = new Meteor.Collection('referencias', {idGeneration : 'MONGO'});


/* Helpers */
Refs.helpers({
    getAutor: function() {
        if (typeof this.autor !== 'undefined') {
            if (typeof this.autor.diputado !== 'undefined') {return this.autor.diputado;}
            else if (typeof this.autor.grupo !== 'undefined') {return this.autor.grupo;}
            else if (typeof this.autor.otro !== 'undefined') {return this.autor.otro;}
            else {return '';}
        }
    },
    getBol: function () {
        if (typeof this.bol !== 'undefined') {
            if (typeof this.bol.bol !== 'undefined') {return this.bol.bol;}
            else {return this.bol;}
        }
    },
    getGrupo: function() {
        if (typeof this.autor !== 'undefined') {
            if (typeof this.autor.grupo !== 'undefined') {return this.autor.grupo;}
            else {return '';}
        }
    },
    getTramite: function() {
        if (typeof this.tramite !== 'undefined') {
            if (typeof this.tramite.tramite !== 'undefined') {return this.tramite.tramite;}
            else {return this.tramite;}
        }
    },
    getUrl: function() {
        if (typeof this.url !== 'undefined') {
            if (typeof this.url.url !== 'undefined') {return this.url.url;}
            else {
                // If it has more than one url, it returns just one
                if (Array.isArray(this.url)) {
                    return this.url[0];
                } else {
                    return this.url;
                }
            }
        }
    }
});


// Methods

Meteor.methods({
  annotateRef: function(id, _titulo, _autor, _dicts, _terms, _annotate){
    if(can.annotateRef(Meteor.user())){
      if (_dicts.length > 0) {
        Refs.update(id, {$set: {dicts: _dicts, terms: _terms, annotate: _annotate, is_tipi: true, titulo_alt: _titulo, autor_alt: _autor}});
      } else {
        Refs.update(id, {$set: {dicts: _dicts, terms: _terms, annotate: _annotate, is_tipi: false, titulo_alt: '', autor_alt: ''}});
      }
    }
    else {
      throw new Meteor.Error(403, 'You do not have the rights to annotate items.')
    }
  }
});


TabularTables = {};

/*
Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

TabularTables.Refs = new Tabular.Table({
  name: "Referencias",
  collection: Refs,
  columns: [
		{data: "ref", title: "Referencia"},
		{data: "autor", title: "Autor"},
		{data: "fecha", title: "Fecha"},
    {data: "texto", title: "Índice"}
  ]
});
*/


// Methods

Meteor.methods({
  //createItem: function(item){
  //  if(can.createItem(Meteor.user()))
  //    Items.insert(item);
  //},
  //removeItem: function(item){
  //  if(can.removeItem(Meteor.user(), item)){
  //    Items.remove(item._id);
  //  }else{
  //    throw new Meteor.Error(403, 'You do not have the rights to delete this item.')
  //  }
  //}
});

/* ---------------------------------------------------- +/

## Items ##

All code related to the Items collection goes here. 

/+ ---------------------------------------------------- */

Refs = new Meteor.Collection('referencias', {idGeneration : 'MONGO'});

// Methods

Meteor.methods({
  annotateRef: function(id, _dicts, _terms, _annotate){
    if(can.annotateRef(Meteor.user())){
      Refs.update(id, {$set: {dicts: _dicts, terms: _terms, annotate: _annotate}});
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

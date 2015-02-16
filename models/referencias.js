/* ---------------------------------------------------- +/

## Items ##

All code related to the Items collection goes here. 

/+ ---------------------------------------------------- */

Refs = new Meteor.Collection('proclines', {idGeneration : 'MONGO'});

// Allow/Deny

Refs.allow({
  insert: function(userId, doc){
    //return can.createItem(userId);
		// Nadie puede insertar ni borrar referencias, pero sí actualizar
		return false;
  },
  update:  function(userId, doc, fieldNames, modifier){
    return can.editRef(userId, doc);
  },
  remove:  function(userId, doc){
    //return can.removeItem(userId, doc);
		return false;
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

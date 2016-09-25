/* ---------------------------------------------------- +/

## Publications ##

All publications-related code. 

/+ ---------------------------------------------------- */


if (Meteor.isServer) {
    
    Meteor.publish('tipiStats', function() {
            return TipiStats.find();
    });

    Meteor.publish('tipiStatsByDict', function(slug) {
        return TipiStats.find(
                {},
                {
                    fields: {'latest': 1}
                }
            );
    });

    Meteor.publish('tipiStatsOverall', function() {
            return TipiStats.find(
                {},
                {
                    fields: {overall: 1},
                    sort: {count: -1},
                });
    });

    Meteor.publish('allSlugsInTipiDicts', function() {
            return Dicts.find(
              {group: "tipi"},
              {
                fields: {name: 1, slug: 1},
              }
            );
    });

    Meteor.publish('allTipiDicts', function() {
            return Dicts.find(
              {group: "tipi"},
              {
                  fields: {name: 1, slug: 1, iconb1: 1}
              }
            );
    });

    Meteor.publish('basicTipiDicts', function() {
            return Dicts.find(
              {group: "tipi"},
              {
                  fields: {_id: 1, name: 1}
              }
            );
    });

    Meteor.publish('allTipiDictsWithDesc', function() {
            return Dicts.find(
              {group: "tipi"},
              {
                  fields: {name: 1, slug: 1, description: 1,  icon1: 1, icon2: 1, iconb1: 1, iconb2: 1}
              }
            );
    });

    Meteor.publish('allTipiDictsWithTerms', function() {
            return Dicts.find(
              {group: "tipi"},
              {
                  fields: {name: 1, slug: 1, iconb1: 1, terms: 1}
              }
            );
    });

    Meteor.publish('singleTipiDictBySlug', function(slug) {
            return Dicts.find(
              {group: "tipi", slug: slug},
              {
                  fields: {name: 1, description: 1, icon1: 1, icon2: 1, iconb1: 1, iconb2: 1, terms: 1}
              }
            );
    });
    
    Meteor.publish('basicTipis', function(q) {
        return Iniciativas.find(
            {'is.tipi': true},
          {
            fields: {_id: 1}
          }
        );
    });

    Meteor.publish('allTipisSearch', function(q) {
        return Iniciativas.find(
          q,
          {
            fields: {ref: 1, titulo: 1, tipotexto: 1, autor_diputado: 1, autor_grupo: 1, autor_otro: 1, lugar: 1, dicts: 1, terms: 1, fecha: 1}, 
            sort: {fecha: 1},
            limit: Meteor.settings.public.queryParams.limit
          }
        );
    });

    Meteor.publish('singleTipi', function(id) {
        initiative = Iniciativas.find({"_id": id, "is.tipi": true});
        if (initiative) return initiative;
        this.stop();
        return;
    });

    Meteor.publish('relatedTipis', function(id) {
        tipiobject = Iniciativas.find({"_id": id, "is.tipi": true}).fetch();
        return Iniciativas.find(
            {ref: tipiobject[0].ref, "is.tipi": true},
            {
                fields: {ref: 1, titulo: 1, tipotexto: 1, autor_diputado: 1, autor_grupo: 1, autor_otro: 1, 'is.tipi': 1},
                sort: {tipotexto: 1}
            }
        );
    });

    Meteor.publish('limitedTipiListByDict', function(dictslug) {
      var dictobject = Dicts.findOne({group: "tipi", slug: dictslug}, {fields: {name: 1}});
      if (dictobject) {
        return Iniciativas.find(
          {'dicts.tipi': dictobject.name, 'is.tipi': true},
          {  
            fields: {ref: 1, tipotexto: 1, autor_diputado: 1, autor_grupo: 1, autor_otro: 1, titulo: 1, 'dicts.tiipi': 1, fecha: 1, lugar: 1}, 
            sort: {fecha: 1},
            limit: 20
          }
        );
      }
      this.stop();
      return;
    });

    Meteor.publish('allDeputies', function(username){
            return Diputados.find(
              {},
              {
                sort: {activo: -1, name: 1}
              }
            );
    });
    
    Meteor.publish('allDeputyNames', function() {
        return Diputados.find(
            {},
            {
                fields: {nombre: 1}
            }
        );
    });

    Meteor.publish('singleDeputyById', function(id) {
        return Diputados.find({_id: id});
    });

    Meteor.publish('limitedTipiListByDeputy', function(id) {
      var dipobject = Diputados.findOne(id, {fields: {nombre: 1}});
      if (dipobject) {
        return Iniciativas.find(
          {autor_diputado: dipobject.nombre, 'is.tipi': true},
          {  
            fields: {ref: 1, tipotexto: 1, titulo: 1, 'dicts.tipi': 1, fecha: 1, lugar: 1}, 
            sort: {fecha: 1},
            limit: 10
          }
        );
      }
      this.stop();
      return;
    });

    Meteor.publish('allGroups', function() {
        return Grupos.find();
    });

    Meteor.publish('singleGroupById', function(id) {
        return Grupos.find({_id: id});
    });

    Meteor.publish('limitedTipiListByGroup', function(id) {
      var groupobject = Grupos.findOne(id, {fields: {nombre: 1}});
      if (groupobject) {
        return Iniciativas.find(
          {autor_grupo: groupobject.nombre, 'is.tipi': true},
          {  
            fields: {ref: 1, tipotexto: 1, autor_diputado: 1, titulo: 1, 'dicts.tipi': 1, fecha: 1, lugar: 1}, 
            sort: {fecha: 1},
            limit: 10
          }
        );
      }
      this.stop();
      return;
    });

    Meteor.publish('userInfo', function(username) {
        return Meteor.users.find({ username: username }, {fields: {services: 0}});
    });

    Meteor.publish('activeBanners', function() {
        return Banners.find({activo: true});
    });

}

/* ---------------------------------------------------- +/

## Publications ##

All publications-related code. 

/+ ---------------------------------------------------- */


if (Meteor.isServer) {
    
    var tipidictgroup = 'tipi';

    Meteor.publish('tipiStats', function() {
            return TipiStats.find();
    });

    Meteor.publish('allSlugsInDicts', function() {
            return Dicts.find(
              {dictgroup:tipidictgroup},
              {
                fields: {dict: 1, slug: 1},
              }
            );
    });
    Meteor.publish('allTipiDicts', function() {
            return Dicts.find(
              {dictgroup: tipidictgroup},
              {
                  fields: {dict: 1, slug: 1, iconb1: 1}
              }
            );
    });

    Meteor.publish('allTipiDictsWithDesc', function() {
            return Dicts.find(
              {dictgroup: tipidictgroup},
              {
                fields: {dict: 1, slug: 1, description: 1,  icon1: 1, icon2: 2}
              }
            );
    });

    Meteor.publish('singleTipiDictBySlug', function(slug) {
            return Dicts.find(
              {dictgroup: tipidictgroup, slug: slug},
              {
                fields: {dict: 1, icon1: 1, icon2: 2}
              }
            );
    });
    
    Meteor.publish('allTipisSearch', function(q) {
            q['invisible'] = false;
            return Tipis.find(
              q,
              {
                fields: {ref: 1, titulo: 1, tipotexto: 1, autor_diputado: 1, autor_grupo: 1, autor_otro: 1, lugar: 1, dicts: 1, terms: 1, fecha: 1}, 
                sort: {fecha: 1},
                limit: Meteor.settings.public.queryParams.limit
              }
            );
    });

    Meteor.publish('singleTipi', function(id) {
        return Tipis.find(id);
    });

    Meteor.publish('relatedTipis', function(id) {
        tipiobject = Tipis.findOne(id);
        return Tipis.find(
            {ref: tipiobject.ref},
            {
                fields: {ref: 1, titulo: 1, tipotexto: 1, autor_diputado: 1, autor_grupo: 1, autor_otro: 1},
                sort: {tipotexto: 1}
            }
        );
    });

    Meteor.publish('limitedTipiListByDict', function(dictslug) {
      var dictobject = Dicts.findOne({dictgroup: tipidictgroup, slug: dictslug}, {fields: {dict: 1}});
      if (dictobject) {
        return Tipis.find(
          {dicts: dictobject.dict},
          {  
            fields: {ref: 1, tipotexto: 1, autor_diputado: 1, autor_grupo: 1, autor_otro: 1, titulo: 1, dicts: 1, fecha: 1, lugar: 1}, 
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
              {tipi: false},
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
        return Diputados.find(id);
    });

    Meteor.publish('limitedTipiListByDeputy', function(id) {
      var dipobject = Diputados.findOne(id, {fields: {nombre: 1}});
      if (dipobject) {
        return Tipis.find(
          {autor_diputado: dipobject.nombre},
          {  
            fields: {ref: 1, tipotexto: 1, titulo: 1, dicts: 1, fecha: 1, lugar: 1}, 
            sort: {fecha: 1},
            limit: 10
          }
        );
      }
      this.stop();
      return;
    });

    Meteor.publish('singleGroupById', function(id) {
        return Grupos.find(id);
    });

    Meteor.publish('limitedTipiListByGroup', function(id) {
      var groupobject = Grupos.findOne(id, {fields: {nombre: 1}});
      if (groupobject) {
        return Tipis.find(
          {autor_grupo: groupobject.acronimo},
          {  
            fields: {ref: 1, tipotexto: 1, autor_diputado: 1, titulo: 1, dicts: 1, fecha: 1, lugar: 1}, 
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

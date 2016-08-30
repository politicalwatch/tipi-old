/* ---------------------------------------------------- +/

## Publications ##

All publications-related code. 

/+ ---------------------------------------------------- */


if (Meteor.isServer) {
    
    var tipidictgroup = 'tipi';

    Meteor.publish('tipiStats', function() {
            return TipiStats.find();
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


    // ##################################################################### //

    /*
     * Publications unused in version 2 (used in version 1)
     * We will mantain this code for future revisions
    */

    Meteor.publish('singleRef', function(id) {
            if (this.userId) {
                    var user = Meteor.users.findOne({_id:this.userId});
                    if (Roles.userIsInRole(user, ["admin","manager"])) {
                        return Refs.find(id);
                    }
            }
            this.stop();
            return;
    });

    Meteor.publish('allTipiDictsWithWords', function() {
            return Dicts.find(
              {dictgroup: tipidictgroup},
              {
                fields: {dictgroup: 1, dict: 1, words:1, description: 1, lastUpdate: 1},
                sort: {dictgroup: -1}
              }
            );
    });

    Meteor.publish('singleDict', function(id) {
            return Dicts.find(id);
    });

    Meteor.publish('allTipis', function() { 
            return Tipis.find(
              {invisible: false},
              {
                fields: {autor: 1, grupo: 1, otro: 1, titulo: 1, dicts: 1, fecha: 1},
                sort: {fecha: -1},
                limit: Meteor.settings.public.queryParams.limit
              }
            );
    });

    Meteor.publish('singleTipiByManager', function(id) {
            if (this.userId) {
                    var user = Meteor.users.findOne({_id:this.userId});
                    if (Roles.userIsInRole(user, ["admin","manager"])) {
                            return Tipis.find(id);
                    }
            }
            this.stop();
            return;
    });

    Meteor.publish('allRefs', function() {
        if (this.userId) {
            var user = Meteor.users.findOne({_id:this.userId});
            if (Roles.userIsInRole(user, ["admin","manager"])) {
                return Refs.find(
                    {invisible: false},
                    {
                        fields: {bol: 1, ref: 1, autor: 1, titulo: 1, dicts: 1, fecha: 1}, 
                        sort: {fecha: -1},
                        limit: Meteor.settings.public.queryParams.limit
                    }
                );
            }
        }
        this.stop();
        return;
    });

    Meteor.publish('allRefsSearch', function(q) { 
        q['invisible'] = false;
        if (this.userId) {
            var user = Meteor.users.findOne({_id:this.userId});
            if (Roles.userIsInRole(user, ["admin","manager"])) {
                return Refs.find(
                    q,
                    {
                        fields: {bol: 1, ref: 1, autor: 1, titulo: 1, dicts: 1, fecha: 1, annotate: 1, is_tipi: 1}, 
                        sort: {fecha: -1},
                        limit: Meteor.settings.public.queryParams.limit
                    }
                );
            }
        }
        this.stop();
        return;
    });

    Meteor.publish('allRefsContent', function() {
        if (this.userId) {
            var user = Meteor.users.findOne({_id:this.userId});
            if (Roles.userIsInRole(user, ["admin","manager"])) {
                return Refs.find(
                    {invisible: false},
                    {
                        fields: {bol: 1, ref: 1, gopag: 1, autor: 1, titulo: 1, dicts: 1, fecha: 1, content: 1}, 
                        sort: {bol: -1, fecha: -1},
                        limit: Meteor.settings.public.queryParams.limit
                    }
                );
            }
        }
        this.stop();
        return;
    });

    Meteor.publish('listUsers', function(user_type) {
        if (this.userId) {
            var user = Meteor.users.findOne({_id:this.userId});
            if (Roles.userIsInRole(user, ["admin"])) {
                return Meteor.users.find(
                    {'profile.is_public': true},
                    {
                        fields: {username: 1, 'profile.firstname': 1, 'profile.lastname': 1, roles: 1, 'status.online': 1, 'emails.0.address': 1}
                    }
                );
            }
        }
        return Meteor.users.find(
            {'profile.is_public': true},
            {
                fields: {username: 1, 'profile.firstname': 1, 'profile.lastname': 1, roles: 1}
            }
        );
    });

}

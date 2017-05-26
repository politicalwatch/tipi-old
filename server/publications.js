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
    
    Meteor.publish("countInitiatives", function () {
      var self = this;
      var count = 0;
      var initializing = true;
      // observeChanges only returns after the initial `added` callbacks
      // have run. Until then, we don't want to send a lot of
      // `self.changed()` messages - hence tracking the
      // `initializing` state.
      var handle = Iniciativas.find({}).observeChanges({
        added: function (id) {
          count++;
          if (!initializing)
            self.changed("counts", {count: count});
        },
        removed: function (id) {
          count--;
          self.changed("counts", {count: count});
        }
        // don't care about changed
      });
      // Instead, we'll send one `self.added()` message right after
      // observeChanges has returned, and mark the subscription as
      // ready.
      initializing = false;
      self.added("counts", {count: count});
      self.ready();
      // Stop observing the cursor when client unsubs.
      // Stopping a subscription automatically takes
      // care of sending the client any removed messages.
      self.onStop(function () {
        handle.stop();
      });
    });

    Meteor.publish('allTipisSearch', function(q) {
        return Iniciativas.find(
          q,
          {
              fields: {ref: 1, titulo: 1, tipotexto: 1, autor_diputado: 1, autor_grupo: 1, autor_otro: 1, lugar: 1, dicts: 1, terms: 1, actualizacion: 1, tramitacion: 1}, 
            sort: {actualizacion: 1},
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
            fields: {ref: 1, tipotexto: 1, autor_diputado: 1, autor_grupo: 1, autor_otro: 1, titulo: 1, 'dicts.tipi': 1, actualizacion: 1, lugar: 1}, 
            sort: {actualizacion: -1},
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
            fields: {ref: 1, tipotexto: 1, titulo: 1, 'dicts.tipi': 1, actualizacion: 1, lugar: 1}, 
            sort: {actualizacion: -1},
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
            fields: {ref: 1, tipotexto: 1, autor_diputado: 1, titulo: 1, 'dicts.tipi': 1, actualizacion: 1, lugar: 1}, 
            sort: {actualizacion: -1},
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

    Meteor.publish('exportUsers', function(user_type) {
        if (this.userId) {
            var user = Meteor.users.findOne({_id:this.userId});
            if (Roles.userIsInRole(user, ["admin"])) {
                return Meteor.users.find(
                        {},
                        {
                            fields: {username: 1, 'profile.firstname': 1, 'profile.lastname': 1, 'emails.0.address': 1, 'profile.dicts': 1}
                        }
                    );
            }
        }
        this.stop();
        return;
    });

    Meteor.publish('activeBanners', function() {
        return Banners.find({activo: true});
    });

    Meteor.publish('news', function() {
        return News.find({}, {
          sort: {fechafecha: -1 }
        });
    });
}

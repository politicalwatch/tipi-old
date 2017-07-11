if (Meteor.isServer) {

    var dict_decode = function(dict) {
        return dict.replace(/\+/g, ' ');
    }
    var terms_decode = function(term) {
        return dict_decode(term);
    }



    var field_opts = {
        autor_diputado: 1,
        autor_grupo: 1,
        autor_otro: 1,
        lugar: 1,
        tipotexto: 1,
        tipo: 1,
        titulo: 1,
        fecha: 1,
        ref: 1,
        tramitacion: 1,
        'dicts.tipi': 1,
        'terms.tipi': 1
    }

    // Global API configuration
    var Api = new Restivus({
        apiPath: 'api/',
        version: 'v1',
        useDefaultAuth: false,
        prettyJson: true
    });
  
    //TIPIS (Params: limit, offset, dict, terms)
    Api.addRoute('tipis/', {
        get: function () {
            var limit =  parseInt(this.queryParams.limit) || 20
            var pag =  parseInt(this.queryParams.offset) || 0
            if (this.queryParams.dict) {
                dict = this.queryParams.dict;
                if (dict.length > 0) {
                    terms = (this.queryParams.terms) ?
                        (_.isArray(this.queryParams.terms)) ? this.queryParams.terms : [this.queryParams.terms]
                        : [];
                    if (terms.length > 0)
                        return Iniciativas.find(
                            {
                                'is.tipi': true,
                                'dicts.tipi': dict,
                                'terms.tipi.humanterm': {$in: terms}
                            },
                            {
                                fields:  field_opts,
                                sort: {fecha: -1},
                                limit: limit,
                                skip : pag
                            }).fetch();
                    else
                        return Iniciativas.find(
                            {
                                'is.tipi': true,
                                'dicts.tipi': dict
                            },
                            {
                                fields:  field_opts,
                                sort: {fecha: -1},
                                limit: limit,
                                skip : pag
                            }).fetch();
                }
                else
                    return {
                        statusCode: 404,
                        body: []
                    }
            }
            else
                return Iniciativas.find(
                    {'is.tipi': true},
                    {
                        fields:  field_opts,
                        sort: {fecha: -1},
                        limit: limit,
                        skip: pag
                    }).fetch();
        }
    });

    //TIPI
    Api.addRoute('tipis/:_id', {
	get: function () {
            var oid = new Meteor.Collection.ObjectID(this.urlParams._id);
            var tipi = Iniciativas.findOne(
                {_id: oid},
                {
                    fields: field_opts,
                });
            if (tipi)
                return tipi;
            else
                return {
                    statusCode: 404,
                    body: []
                }
	}
    });


    //STATS

    //overall (Params: dict)
    Api.addRoute('stats/overall', {
        get: function () {
            if (this.queryParams.dict) {
                dict = this.queryParams.dict;
                stat = TipiStats.find(
                    {'overall._id':dict},
                    {
                        fields:{
                            overall:1,
                            '_id': false
                        }
                    }).fetch();
                if (stat.length > 0) {
                    res = [];
                    for (item in stat[0].overall) {
                        element = stat[0].overall[item];
                        if(element._id == dict) {
                            res.push(element);
                            break;
                        }
                    }
                    if (res.length > 0)
                        return res;
                    else
                        return {
                            statusCode: 404,
                            body: []
                        }
                }
                else
                    return {
                        statusCode: 404,
                        body: []
                    }
            }
            else
                return TipiStats.find(
                    {},
                    {
                        fields: {
                            overall:1,
                            '_id': false
                        }
                    }).fetch();
        }
    });


    //bydeputies (Params dict)
    Api.addRoute('stats/bydeputies', {
        get: function () {
            if (this.queryParams.dict) {
                dict = this.queryParams.dict;
                stat = TipiStats.find(
                    {'bydeputies._id':dict},
                    {
                        fields:{
                            bydeputies:1,
                            '_id': false
                        }
                    }).fetch();
                if (stat.length > 0){
                    res = [];
                    for (item in stat[0].bydeputies) {
                        element = stat[0].bydeputies[item];
                        if(element._id == dict) {
                            res.push(element);
                            break;
                        }
                    }
                    if (res.length > 0)
                        return res;
                    else
                        return {
                            statusCode: 404,
                            body: []
                        }
                    }

                else
                    return {
                        statusCode: 404,
                        body: []
                    }
            }
            else
                return TipiStats.find(
                    {},
                    {
                        fields:{
                            bydeputies:1,
                            '_id': false
                        }
                    }).fetch();
        }
    });

    //bygroups (Params: dict)
    Api.addRoute('stats/bygroups', {
        get: function () {
            if (this.queryParams.dict) {
                dict = this.queryParams.dict;
                stat = TipiStats.find(
                    {'bygroups._id':dict},
                    {
                        fields:{
                            bygroups:1,
                            '_id': false
                        }
                    }).fetch();
                if (stat.length > 0) {
                    res=[];
                    for (item in stat[0].bygroups) {
                        element=stat[0].bygroups[item]
                        if(element._id == dict) {
                            res.push(element);
                            break;
                        }
                    }
                    if (res.length > 0)
                        return res
                    else
                        return {
                            statusCode: 404,
                            body: []
                        }
                }
                else
                    return {
                        statusCode: 404,
                        body: []
                    }
                    //
            }
            else
                return TipiStats.find(
                    {},
                    {
                        fields: {
                            bygroups:1,
                            '_id': false
                        }
                }).fetch();
        }
    });


    //dicts
    Api.addRoute('dicts/', {
        get: function () {
          return Dicts.find(
              {}, 
              {
                  fields:{
                      name:1,
                      '_id': false
                  }
              }).fetch();

        }
               
    });

};

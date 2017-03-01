


if (Meteor.isServer) {

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
//TIPIS
Api.addRoute('tipis/', {
    get: function () {
    	var limit =  parseInt(this.queryParams.limit) || 10
    	var pag =  parseInt(this.queryParams.offset) || 0

    	
    	if (this.queryParams.dict) {
    		dict = Dicts.find({slug: this.queryParams.dict, group: "tipi"},{fields: {name: 1}}).fetch();
    		if (dict.length>0) {
                    terms = (this.queryParams.terms) ?
                        (_.isArray(this.queryParams.terms)) ? this.queryParams.terms : [this.queryParams.terms]
                        : [];
                    if (terms.length > 0) {
    			return Iniciativas.find(
                            {
                                'is.tipi': true,
                                'dicts.tipi': dict[0].name,
                                'terms.tipi.humanterm': {$in: terms}
                            },
                            {
                                fields:  field_opts,
                                sort: {fecha: -1},
                                limit: limit,
                                skip : pag
                            }).fetch();

                    } else {
    			return Iniciativas.find(
                            {
                                'is.tipi': true,
                                'dicts.tipi': dict[0].name
                            },
                            {
                                fields:  field_opts,
                                sort: {fecha: -1},
                                limit: limit,
                                skip : pag
                            }).fetch();

                    }
    		} else {
    			return {
			    statusCode: 404,
			    body: []
			}
		}			 
    	} else {
    	    return Iniciativas.find(
    	    	{'is.tipi': true},
                {
                    fields:  field_opts,
                    sort: {fecha: -1},
                    limit: limit,
                    skip: pag
                }).fetch();
    	}
    }
});



Api.addRoute('tipis/:_id', {
	get: function () {
            var oid = new Meteor.Collection.ObjectID(this.urlParams._id);
            var tipi = Iniciativas.findOne(
                {_id: oid},
                {
                    fields: field_opts,
                });
            if (tipi){
                return tipi
            } else {
                    return {
                        statusCode: 404,
                        body: []
                    }
            }
	}
});

//STATS
//overall
Api.addRoute('stats/overall', {
    get: function () {
        return TipiStats.find({},{fields:{overall:1,'_id': false}}).fetch()

    }
           
});


Api.addRoute('stats/overall/:slug', {
    get: function () {
        dict = Dicts.find({slug: this.urlParams.slug, group: "tipi"},{fields: {name: 1}}).fetch();

        if (dict.length>0){
            stat = TipiStats.find({overall:{$elemMatch:{_id:dict[0].name}}},{fields:{overall:1,'_id': false}}).fetch()
            
            if (stat){
                res=[]
                for (item in stat[0].overall) {
                    element=stat[0].overall[item]
                    if(element._id==dict[0].name){
                        res.push(element)
                        break
                    }
                }
                if (res){
                    return res
                }else{
                    return {
                        statusCode: 404,
                        body: []
                        }
                }

            } else {
                return {
                        statusCode: 404,
                        body: []
                        }
            }
        }else{
            return {
                    statusCode: 404,
                    body: []
                    }
        }


    }
           
});


//bydeputies
Api.addRoute('stats/bydeputies', {
    get: function () {
        return TipiStats.find({},{fields:{bydeputies:1,'_id': false}}).fetch()

    }
           
});


Api.addRoute('stats/bydeputies/:slug', {
    get: function () {
        dict = Dicts.find({slug: this.urlParams.slug, group: "tipi"},{fields: {name: 1}}).fetch();
        if (dict.length>0){
            stat = TipiStats.find({bydeputies:{$elemMatch:{_id:dict[0].name}}},{fields:{bydeputies:1,'_id': false}}).fetch()
            console.log(stat)
            if (stat){
                 res=[]
                for (item in stat[0].bydeputies) {
                    element=stat[0].bydeputies[item]
                    if(element._id==dict[0].name){
                        res.push(element)
                        break
                    }
                }
                if (res){
                    return res
                }else{
                    return {
                        statusCode: 404,
                        body: []
                        }
                }

            } else {
                return {
                        statusCode: 404,
                        body: []
                        }
            }
        }else{
            return {
                    statusCode: 404,
                    body: []
                    }
        }


    }
           
});

//bygroups
Api.addRoute('stats/bygroups', {
    get: function () {
        return TipiStats.find({},{fields:{bygroups:1,'_id': false}}).fetch()

    }
           
});


Api.addRoute('stats/bygroups/:slug', {
    get: function () {
        dict = Dicts.find({slug: this.urlParams.slug, group: "tipi"},{fields: {name: 1}}).fetch();
        if (dict.length>0){
            stat = TipiStats.find({bygroups:{$elemMatch:{_id:dict[0].name}}},{fields:{bygroups:1,'_id': false}}).fetch()
            if (stat){
                res=[]
                for (item in stat[0].bygroups) {
                    element=stat[0].bygroups[item]
                    if(element._id==dict[0].name){
                        res.push(element)
                        break
                    }
                }
                if (res){
                    return res
                }else{
                    return {
                        statusCode: 404,
                        body: []
                        }
                }

            } else {
                return {
                        statusCode: 404,
                        body: []
                        }
            }
        }else{
            return {
                    statusCode: 404,
                    body: []
                    }
        }


    }
           
});


//latest
Api.addRoute('stats/latest', {
    get: function () {
        return TipiStats.find({},{fields:{latest:1,'_id': false}}).fetch()

    }
           
});




Api.addRoute('stats/latest/:slug', {
    get: function () {
        dict = Dicts.find({slug: this.urlParams.slug, group: "tipi"},{fields: {name: 1}}).fetch();
        if (dict.length>0){
            stat = TipiStats.find({latest:{$elemMatch:{_id:dict[0].name}}},{fields:{latest:1,'_id': false}}).fetch()
            if (stat){
                res=[]
                for (item in stat[0].latest) {
                    element=stat[0].latest[item]
                    if(element._id==dict[0].name){
                        res.push(element)
                        break
                    }
                }
                if (res){
                    return res
                }else{
                    return {
                        statusCode: 404,
                        body: []
                        }
                }
            } else {
                return {
                        statusCode: 404,
                        body: []
                        }
            }
        }else{
            return {
                    statusCode: 404,
                    body: []
                    }
        }

    }
           
});

Api.addRoute('dicts/', {
    get: function () {
      return Dicts.find({}, {fields:{name:1,slug:1,'_id': false}}).fetch()

    }
           
});




}; //end

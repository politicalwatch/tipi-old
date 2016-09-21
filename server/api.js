


if (Meteor.isServer) {

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

    	
    	if (this.queryParams.dict){
    		dict = Dicts.find({slug: this.queryParams.dict, group: "tipi"},{fields: {name: 1}}).fetch();
    		if (dict.length>0) {
    			return Iniciativas.find({'is.tipi':true,'dicts.tipi':dict[0].name}, {limit: limit, skip : pag }).fetch();
    		} else {
    			return {
			    statusCode: 404,
			    body: []
			}
		}			 
    	} else {
            
    	    return Iniciativas.find({}, {limit: limit, skip: pag }).fetch();
    	}
    }
});



Api.addRoute('tipis/:_id', {
	get: function () {
            var oid = new Meteor.Collection.ObjectID(this.urlParams._id);
            var tipi=Iniciativas.findOne(oid);
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
                return stat
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
            if (stat){
                return stat
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
                return stat
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
                return stat
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


}; //end

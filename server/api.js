


if (Meteor.isServer) {

  // Global API configuration
  var Api = new Restivus({
  	apiPath: 'api/',
    version: 'v1',
    useDefaultAuth: false,
    prettyJson: true
  });

Api.addRoute('tipis/', {
    get: function () {
    	var limit =  parseInt(this.queryParams.limit) || 10
    	var pag =  parseInt(this.queryParams.offset) || 0

    	
    	if (this.queryParams.dict){
    		dict= Dicts.find({slug:this.queryParams.dict,dictgroup:"tipi"},{fields:{dict:1}}).fetch();
    		console.log(dict);
    		if (dict.length>0){

    			return Tipis.find({dicts:dict[0].dict}, {limit: limit, skip : pag }).fetch();
    		}else{
    			return {
					  statusCode: 404,
					  body: []
						}
				}
					 
    	}else{
    		return Tipis.find({}, {limit: limit, skip : pag }).fetch();

    	}

    					//endget},
						
	},

}
);



Api.addRoute('tipis/:_id', {
	get: function () {
		var oid = new Meteor.Collection.ObjectID(this.urlParams._id);
		var tipi=Tipis.findOne(oid);
		if (tipi){
			return tipi

		}else{

			return {
		  			statusCode: 404,
		  			body: []
					}

		}

	},

}
);




};//end
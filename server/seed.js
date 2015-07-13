/* ---------------------------------------------------- +/

Fill in the app with initial data if database is empty.

/+ ---------------------------------------------------- */

/*
Roles that must appear into the db
    admin
    manager
    mdblog-author
    deputy
    organization
    media
*/

// Insert initial data here

if (TipiAlerts.find().count() == 0) {
    dicts = Dicts.find({dictgroup: 'tipi'}, {fields: {dict: 1}}).fetch();
    _.each(dicts, function(dict) {
        TipiAlerts.insert({dict: dict.dict, items: []});
    });            
}
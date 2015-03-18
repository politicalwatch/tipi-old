
library("rmongodb")
source("../mongodb-creds.R")

MONGODB_HOST_URL <- paste(MONGODB_HOST, MONGODB_DATABASE, "/")

if(!mongo.is.connected(mongo)) {
	mongo <- mongo.create(host=MONGODB_HOST_URL)
	mongo.authenticate(mongo, username=MONGODB_USERNAME, password=MONGODB_PASSWORD, db=MONGODB_DATABASE)
}

mongo_collection <- function(collection_name) {
	return(paste0(MONGODB_DATABASE, ".", collection_name))
}


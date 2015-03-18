
MONGODB_HOST     <- "localhost:27017"
MONGODB_USERNAME <- "alesegdia"
MONGODB_PASSWORD <- "1234"
MONGODB_DATABASE <- "tipi_test"
MONGODB_HOST_URL <- paste(MONGODB_HOST, MONGODB_DATABASE, "/")

mongo <- mongo.create(host=MONGODB_HOST_URL)
mongo.authenticate(mongo, username=MONGODB_USERNAME, password=MONGODB_PASSWORD, db=MONGODB_DATABASE)

mongo_collection <- function(collection_name) {
	return(paste0(MONGODB_DATABASE, collection_name, "."))
}

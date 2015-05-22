options(stringsAsFactors=FALSE)

GENERATED_BASE_DIR <- "gendir/"

ERROR_LOG_FILE <- "/home/razieliyo/Rtipi_error.log"

check_in_sublists_index <- function(list2d, to_check) {
	if( length(list2d) > 0 ) {
		for(i in 1:length(list2d)){
			if( to_check %in% list2d[[i]] ) {
				return(TRUE)
			}
		}
	}
	return(FALSE)
}

check_in_mongo <- function(json_query) {
	q <- mongo.bson.from.JSON(json_query )
	a <- mongo.find(mongo, mongo_collection(collection_name), q)
	return(mongo.cursor.next(a))
}

write_error_log <- function(error) {
	file <- file(ERROR_LOG_FILE)
	writeLines(error, file)
	close(file)
}

options(stringsAsFactors=FALSE)

GENERATED_BASE_DIR <- "gendir/"

ERROR_LOG_BASE_DIR <- "~/tmp/"

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

write_error_log <- function(model, element, error) {
	outfile = paste0(ERROR_LOG_BASE_DIR, "Rtipi_errors_", model, ".log", sep="")
	write(c(Sys.time(), "\n", model, toString(element), error, "\n\n"), file=outfile, append=TRUE) #c(model, "\n", element, "\n", error), file )
}

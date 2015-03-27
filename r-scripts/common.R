GENERATED_BASE_DIR <- "gendir/"

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

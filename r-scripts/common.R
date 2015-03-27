GENERATED_BASE_DIR <- "gendir/"

check_in_sublists_index <- function(list2d, to_check) {
	for(i in 1:5){
		if( to_check %in% list2d[[i]] ) {
			return(TRUE)
		}
	}
	return(FALSE)
}

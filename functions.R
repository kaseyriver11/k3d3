

findValues <- function(df){
    #dframe <- as.data.frame(rep(1,length(which(df$parent_name == df$node_name[1]))))
    dframe <- as.data.frame(df$node_name[2:(length(which(df$parent_name == df$node_name[1]))+1)])
    colnames(dframe) <- "name"
    dframe$name <- as.character(dframe$name)
    # Go through each node, finding the names of the children
    for(i in 1:20){
        round = i
        level <- paste0("level", round)
        for(i in 1:dim(dframe)[1]){
            dframe[i,level] <- paste(df$node_name[which(df$parent_name %in% strsplit(dframe[i,round], ";")[[1]])], collapse = ";")
        }
    }
    # Trim off anything extra
    dframe <- dframe[ ,which(sapply(dframe, function(x) all(x == "")) == FALSE)]
    # Find the column with the maximum numbers of leaves
    dd <- dim(dframe)[2]
    for(i in 1:dd){
        dframe[,(i+dd)] <- 1
        for(j in 1:20){
            dframe[j,(i+dd)] <- max(length(which(df$parent_name %in% strsplit(dframe[j,i], ";")[[1]])),1)
        }
    }
    HT <<- max(colSums(dframe[,(dd+1):dim(dframe)[2]]))
    WD <<- dd + 1
}

findValues(df)




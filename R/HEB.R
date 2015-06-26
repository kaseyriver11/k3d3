#' Hierarchical Edge Bundling
#'
#' Create a HEB D3 Visualization
#' 
#' @param data the json file being used for the visualizations.
#' @param width width for the graph's frame area (in pixels) - default is null.
#' @param height height for the graph's frame area (in pixels) - default is null.
#' @param diameter the diameter of the circle being created.
#' @param radiusreducer the actually inner circle radius is inversely related to this number.
#'          The calculation is diameter/2 - radiusreducer. The larger this number, the smaller the radius.
#' @param degrees the number of degrees of a circle the visualization will use. Default is 360 because
#'          it is creating a full circle.  
#'          
#' @examples
#' \dontrun{
#' # Create the Data Frame
#' library(datasets) # We need the data
#' library(RJSONIO)  # To convert data to JSON
#' df <- data.frame(name = rownames(mtcars), cylinders = mtcars$cyl)
#' # Make the json 
#' cyltype <- as.character(unique(df$cylinders))
#' cyl <- lapply(1:length(cyltype), function(y){
#' list(name=paste0("data.cylinder.", cyltype[y], sep = ""), 
#' size = 3938,imports = c("",""))})
#' cyl <- toJSON(cyl) #change it for the json, removing [
#' cyl <- substr(cyl,1,nchar(cyl)-1);  
#' names <- as.character(unique(df$name))
#' name <- lapply(1:length(names), 
#' function(y){list(name=paste0("data.name.", names[y], sep = ""), size = 3938,
#' imports = c("","", paste0("data.cylinder.", df$cylinder[which(names[y] == df$name)])))})
#' name <- toJSON(name);
#' name <- name <- substring(name,2)
#' # Clean up the json
#' a <- paste(cyl, name, sep = ",")
#' a <- gsub('"", "", ', "", a, fixed = T); a <- gsub('"", "" ', "", a, fixed = T)
#' # Call the Function
#' HEB(a)
#' }
#' 
#' @source
#' D3.js was created by Michael Bostock. See \url{http://d3js.org/}
#' 
#' @import htmlwidgets
#'
#' @export
HEB <- function(data, 
                width = NULL,
                height = NULL,
                diameter = 600, 
                radiusreducer = 120,
                degrees = 360)
{

    # create options
    options = list(
        width = width,
        height = height,
        diameter = diameter,
        radiusreducer = radiusreducer,
        degrees = degrees
    )
    
    # create widget
    htmlwidgets::createWidget(
        name = "HEB",
        x = list(data = data, options = options),
        width = width,
        height = height,
        htmlwidgets::sizingPolicy(padding = 0, browser.fill = TRUE),
        package = "k3d3"
    )
}


#' @rdname k3d3-shiny
#' @export
HEBOutput <- function(outputId, width = "100%", height = "500px") {
    shinyWidgetOutput(outputId, "HEB", width, height,
                      package = "k3d3")
}

#' @rdname k3d3-shiny
#' @export
renderHEB <- function(expr, env = parent.frame(), quoted = FALSE) {
    if (!quoted) { expr <- substitute(expr) } # force quoted
    shinyRenderWidget(expr, HEBOutput, env, quoted = TRUE)
}



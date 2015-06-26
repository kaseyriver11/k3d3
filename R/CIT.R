#' D3 Visualization: Collapsible Indented Tree
#'
#' Creates a collapsible indented tree. 
#' 
#' @param data the json file being used for the visualizations.
#' @param width width for the graph's frame area (in pixels) - default is null.
#' @param height height for the graph's frame area (in pixels) - default is null.
#' @param color1 the color of the bars when the branch is collapsed
#' @param color2 the color of the bars when the branch is not collapsed
#' @param color3 the color of the bars that represent the children
#'
#' @examples
#' \dontrun{
#' # load in an appropriate json file. 
#' # Such as \url{https://gist.github.com/mbostock/1093025#file-flare-json}
#' # we will call this json.json
#' CIT(json.json) # This should reproduce the Mike Bostock's Example
#' CIT(json.json, color1 = "blue", color2 = "red", color3 = "green") 
#' # Here we change around the colors of the visualization.
#' }
#' 
#' @source
#' D3.js was created by Michael Bostock. See \url{http://d3js.org/}
#'
#' @import htmlwidgets
#'
#' @export
CIT <- function(data,
                height = NULL,
                width = NULL,
                color1 = "#bd3182", # This is a purple color
                color2 = "#31bd6c", # This is a green/blue color
                color3 = "#c6dbef") # This is a lighter green/blue color
{
    
    # create options
    options = list(
        color1 = color1,
        color2 = color2,
        color3 = color3
    )
    
    # create widget
    htmlwidgets::createWidget(
        name = "CIT",
        x = list(data = data, options = options),
        width = width,
        height = height,
        htmlwidgets::sizingPolicy(padding = 0, browser.fill = TRUE),
        package = "k3d3"
    )
}


#' @rdname k3d3-shiny
#' @export
CITOutput <- function(outputId, width = "100%", height = "500px") {
    shinyWidgetOutput(outputId, "CIT", width, height,
                      package = "k3d3")
}

#' @rdname k3d3-shiny
#' @export
renderCIT <- function(expr, env = parent.frame(), quoted = FALSE) {
    if (!quoted) { expr <- substitute(expr) } # force quoted
    shinyRenderWidget(expr, CITOutput, env, quoted = TRUE)
}


#' D3 Visualizations: Collapsible Tree
#'
#' Creates a collapsible tree given an appropraite json file.
#'
#' @param data the json file being used for the visualizations.
#' @param width width for the graph's frame area (in pixels) - default is null.
#' @param height height for the graph's frame area (in pixels) - default is null.
#' @param HT what is the maximum number of leaves in a column
#' @param WD what is the maximum depth of the tree
#' @param maxChar what is the maximum number of characters in a nodes text
#' @param maxsize what is the root nodes size
#' @param color1 the color of the circles which still have children - default lightbluesteel
#' @param color2 the color of the circles whose children are already shown, or that do not have children - default black
#' @param color3 the color of the outside of the circles - default steelblue
#' @param color4 the color of the lines connecting the circles - default grey
#'
#' @examples
#' \dontrun{
#' # load in an appropriate json file.
#' # Such as \url{https://gist.github.com/mbostock/1093025#file-flare-json}
#' # we will call this json.json
#' aCTR(json.json) # This should reproduce the Mike Bostock's Example
#' aCTR(json.json, color1 = "blue", color2 = "red", color3 = "green", color4 = "black")
#' # Here we change around the colors of the visualization.
#' }
#'
#' @source
#' D3.js was created by Michael Bostock. See \url{http://d3js.org/}
#'
#' @import htmlwidgets
#'
#' @export
aCTR <- function(data,
                width = 500,
                height = 300,
                HT = 20,
                WD = 6,
                maxChar = 50,
                maxsize=20,
                minimum_distance = 21,
                top_bar = 'BRAND, SEGMENT, BASE SIZE, SUB1, SUB2, SUB3',
                color1 = "lightsteelblue",
                color2 = "#fff",
                color3 = "steelblue",
                color4 = "#ccc")
{

    # create options
    options = list(
        width = width,
        height = height,
        HT = HT,
        WD = WD,
        maxChar = maxChar,
        maxsize=maxsize,
        minimum_distance = minimum_distance,
        top_bar = top_bar,
        color1 = color1,
        color2 = color2,
        color3 = color3,
        color4 = color4
    )

    # create widget
    htmlwidgets::createWidget(
        name = "aCTR",
        x = list(data = data, options = options),
        width = width,
        height = height,
        htmlwidgets::sizingPolicy(padding = 0, browser.fill = TRUE),
        package = "k3d3"
    )
}


#' @rdname k3d3-shiny
#' @export
aCTROutput <- function(outputId, width = "100%", height = "500px") {
    shinyWidgetOutput(outputId, "aCTR", width, height,
                      package = "k3d3")
}

#' @rdname k3d3-shiny
#' @export
arenderCTR <- function(expr, env = parent.frame(), quoted = FALSE) {
    if (!quoted) { expr <- substitute(expr) } # force quoted
    shinyRenderWidget(expr, aCTROutput, env, quoted = TRUE)
}

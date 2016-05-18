#' D3 Icicile Plot
#'
#' Create an Icicle D3 Visualization
#' 
#' @param data A character string, one line, containing the JSON data to be parsed.
#' @param width Width for the graph's frame area (in pixels) - default is null.
#' @param height Height for the graph's frame area (in pixels) - default is null.
#' @param color Place to add custom color for the ICICLE - default is d3.scale.category20().
#' @param mousemove Variable to add custom JS for a tooltip that appears on hover. The example uses this with DIV tags. 
#'          
#' @examples
#' \dontrun{
#' ICICLE("a")
#' }
#' @source
#' D3.js was created by Michael Bostock. See \url{http://d3js.org/}
#' 
#' @import htmltools
#' @import htmlwidgets
#'
#' @export
ICICLE <- function(data,
                   width = 960,
                   height = 500,
                   color =  "d3.scale.category20()",
                   mousemove = NULL) 
{
    # create options
    options = list(
        width = width,
        height = height,
        color = JS(color),
        mousemove = JS(mousemove)
    )
    # create widget
    htmlwidgets::createWidget(
        name = "ICICLE",
        x = list(data = data, options = options),
        width = width,
        height = height,
        htmlwidgets::sizingPolicy(padding = 0, browser.fill = TRUE),
        package = "k3d3"
    )
}


#' @rdname k3d3-shiny
#' @export
ICICLEOutput <- function(outputId, width = "100%", height = "500px") {
    shinyWidgetOutput(outputId, "ICICLE", width, height,
                      package = "k3d3")
}

#' @rdname k3d3-shiny
#' @export
renderICICLE <- function(expr, env = parent.frame(), quoted = FALSE) {
    if (!quoted) { expr <- substitute(expr) } # force quoted
    shinyRenderWidget(expr, ICICLEOutput, env, quoted = TRUE)
}






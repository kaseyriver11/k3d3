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
#'library(k3d3)
#'library(RJSONIO)
#'library(stringr)
#'library(htmltools)
#'icicleData <- read.csv("csv_files/NC_counties.csv")
#'makeList<-function(x){ 
#'   if(ncol(x)>2){
#'       listSplit<-split(x[-1],x[1],drop=T)
#'       lapply(names(listSplit),function(y){
#'           if(as.character(listSplit[[y]][1,1]) > 0 & is.integer(listSplit[[y]][1,1]) == FALSE){
#'               list(name=y,size=listSplit[[y]]$Size[1], Square_Miles=listSplit[[y]]$Square_Miles[1], children=makeList(listSplit[[y]]))
#'            } else if(nchar(as.character(listSplit[[y]][1,1])) == 0 & dim(listSplit[[y]])[1] != 1) {
#'               list(name=y,size=listSplit[[y]]$Size[1],Square_Miles=listSplit[[y]]$Square_Miles[1], children=makeList(listSplit[[y]][-1,]))        
#'           } else {
#'               list(name=y,size=listSplit[[y]]$Size[1], Square_Miles=listSplit[[y]]$Square_Miles[1])
#'           }}) 
#'   }else{ lapply(seq(nrow(x[1])),function(y){list(name=x[,1][y],size=x[,2][y])})
#'  }
#'}
#'jsonIcicle <- toJSON(makeList(icicleData))
#'jsonIcicle <- str_replace_all(jsonIcicle, "[\r\n]" , ""); #remove string info;
#'jsonIcicle <- substr(jsonIcicle, 2, nchar(jsonIcicle)-1); #remove first character
#'JSmousemove <- 'function(d) {var formatComma = d3.format(","); var xPosition = d3.event.pageX + 5;var yPosition = d3.event.pageY + 5;    d3.select("#tooltip #county").text(function() { return d.parent ? d.parent.name + ": " + d.name: d.name; });d3.select("#tooltip #population").text("Population: " + formatComma(d.size));d3.select("#tooltip #sqmiles").text("Square Miles " + formatComma(d.Square_Miles));d3.select("#tooltip").classed("hidden", false);}'
#'html_print(tagList(ICICLE(jsonIcicle, mousemove = JSmousemove),
#'                 tags$div(id="tooltip", class="hidden",
#'                          tags$p(strong(id="county")),tags$p(strong(id="population")),tags$p(strong(id="sqmiles"))
#'                 )
#'))
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
                   textcolor = "#000000",
                   mousemove = NULL) 
{
    # create options .
    options = list(
        width = width,
        height = height,
        color = JS(color),
        textcolor = textcolor,
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






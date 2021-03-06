% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/CIT.R, R/CTR.R, R/HEB.R, R/ICICLE.R, R/aCTR.R,
%   R/k3d3.R
\name{CITOutput}
\alias{CITOutput}
\alias{renderCIT}
\alias{CTROutput}
\alias{renderCTR}
\alias{HEBOutput}
\alias{renderHEB}
\alias{ICICLEOutput}
\alias{renderICICLE}
\alias{aCTROutput}
\alias{arenderCTR}
\alias{k3d3-shiny}
\title{This is a list of the shiny bindings for the functions in the k3d3 package.
This includes the output and render functions needed to use k3d3 widgets in R Shiny}
\source{
This RD file using explanations written by Christopher Gandrud
See \url{https://github.com/christophergandrud/networkD3/blob/master/R/networkD3.R}
}
\usage{
CITOutput(outputId, width = "100\%", height = "500px")

renderCIT(expr, env = parent.frame(), quoted = FALSE)

CTROutput(outputId, width = "100\%", height = "500px")

renderCTR(expr, env = parent.frame(), quoted = FALSE)

HEBOutput(outputId, width = "100\%", height = "500px")

renderHEB(expr, env = parent.frame(), quoted = FALSE)

ICICLEOutput(outputId, width = "100\%", height = "500px")

renderICICLE(expr, env = parent.frame(), quoted = FALSE)

aCTROutput(outputId, width = "100\%", height = "500px")

arenderCTR(expr, env = parent.frame(), quoted = FALSE)
}
\arguments{
\item{outputId}{output variable to read from}

\item{width, height}{Must be a valid CSS unit (like \code{"100\%"},
\code{"400px"}, \code{"auto"}) or a number, which will be coerced to a
string and have \code{"px"} appended.}

\item{expr}{An expression that generates a networkD3 graph}

\item{env}{The environment in which to evaluate \code{expr}.}

\item{quoted}{Is \code{expr} a quoted expression (with \code{quote()})? This
is useful if you want to save an expression in a variable.}
}
\description{
This is a list of the shiny bindings for the functions in the k3d3 package.
This includes the output and render functions needed to use k3d3 widgets in R Shiny
}

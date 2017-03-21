HTMLWidgets.widget({

  name: 'aCTR',

  type: 'output',

  initialize: function(d, width, height) {
     d3.select(d).append("svg")
      .attr("width", 100)
      .attr("height", 100);

    return d3.layout.tree();
  },

  resize: function(d, width, height) {
     d3.select(d).select("svg")
      .attr("width", 100)
      .attr("height", 100);
  },

renderValue: function(d, x, instance) {




var margin = {top: 30, right: 20, bottom: 30, left: 120},
    width = (x.options.WD*225 +50),
	height = Math.max((x.options.HT*21+120), 800); // minimum height of 800. 
console.log(width)
var windowsize = window.innerWidth;
 // var spaceLeft = (((windowsize - x.options.WD*225)/4)-10);
var spaceLeft = 50; // move visual over 10 pixels


var i = 0,
 duration = 750,
 root;

var maxdepth = x.options.HT // The maximum number of leaves in a single column - Calculated in R before loading data
var maxwidth = x.options.WD // The maximum number of branches deep in a single line - Calculated in R before loading data

var createSpace = Math.ceil(x.options.maxChar/28)*12
console.log(x.options.WD, x.options.maxChar)
var hSeparationBetweenNodes = Math.max(((800/x.options.HT)-2), x.options.minimum_distance, createSpace); // 21 is the minimum to prevent overlap. However, if we have room - use it 
var vSeparationBetweenNodes = 2;

var tree = d3.layout.tree()
	.sort(function(a, b) { return d3.descending(Number(a.size), Number(b.size)); })
//	.size([height, width]); // Cannot used .size and .nodeSize together. .nodeSize covers .size // 
    .nodeSize([hSeparationBetweenNodes, vSeparationBetweenNodes]) // This prevents overlap by making a minimum distance between nodes
    .separation(function(a, b) {
        return a.parent == b.parent ? 1 : 1.02;
    });

var diagonal = d3.svg.diagonal()
 .projection(function(d) { return [d.y, d.x]; });
 
// Remove the previous svg element
var svg = d3.select(d).select("svg");
    svg.selectAll("*").remove();
    svg.selectAll("rect.negative").remove()


// var svg = d3.select("body").append("svg")
var svg = d3.select(d).append("svg")
	.attr("id", "bigSVG")
	.attr("width",(width + margin.right + margin.left))
	//.attr("width", Math.max(width + margin.right + margin.left, x.options.width))
	//.attr("width", windowsize)
	.attr("height", Math.max(height + margin.top + margin.bottom, x.options.height, x.options.minimum_distance*x.options.HT)) // added + 20 to give a tiny bit of extra room. 
	.append("g")
	.style("align", "center")
	.attr("transform", "translate(" + spaceLeft + "," + (margin.top+(((hSeparationBetweenNodes)*maxdepth)/1.9) + 20) + ")"); // Where does the visual start
	// We calculate how deep the tree is, and how much room we allowed. Then devide this in half to tell how far down to move the visual // 
    svg.selectAll("*").remove(); // REMOVE EXISTING


var flare = JSON.parse(x.data); // d3.json("hi.json", function(error, flare)
    root = flare;
    root.x0 = height / 2;
    root.y0 = 0;

function collapse(d) {
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
        }
        }

//root.children.forEach(collapse);
update(root);

d3.select(self.frameElement).style("height", "800px");

var keep = 0 // need this to see how far the tree has grown

function update(source) {
    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);

// Normalize for fixed-depth.
 nodes.forEach(function(d) { d.y = d.depth * 225; });

// Update the nodes.
var node = svg.selectAll("g.node")
 .data(nodes, function(d) { return d.id || (d.id = ++i); })
 .style("cursor", "pointer");
 
// Enter any new nodes at the parent's previous position.
var nodeEnter = node.enter().append("g")
 .attr("class", "node")
 .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; }) // Where do the pieces move from? 
 .on("click", click);
 
nodeEnter.append("circle")
 .attr("r", function(d) { if(d.icon == ""){return d.size}else{return 0}})
 // .attr("r", function(d) { return d.icon ? 0 : d.size})
 .style({"fill": function(d) { return d._children ? x.options.color3 : d.level}, "stroke": x.options.color3, "stroke-width":"1.5px"})
 //.style({"opacity": function(d) {if(d.icon == ""){0}}});

nodeEnter.append("image")
  .attr("xlink:href", function(d) { return d.icon; })
  .attr("x", "-12px")
  .attr("y", "-12px")
  .attr("width", "24px")
  .attr("height", "24px");  

nodeEnter.append("text")
  .attr('font-family', 'FontAwesome')
  .attr("x", function(d) { return d.children || d._children ? -2 : 2; })
  .attr('class', 'top-text')
  .attr("dy", "-0.15em")
  .attr("transform"," translate(17,0)")
  .attr("text-anchor", "start")//function(d) { return d.children || d._children ? "start" : "end"; })
  .style({"font": "10px sans-serif", "fill-opacity": 1e-6})
  .text(function(d) { return d.name; })
  .call(wrap,150);
 

// Transition nodes to their new position.
// Transition nodes to their new position.
var nodeUpdate = node.transition()
 .duration(duration)
 .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

nodeUpdate.select("circle")
 .attr("r", function(d) { return 5*Math.sqrt(Number(d.size)/Math.PI) })
 .attr("r", function(d) { if(d.icon == ""){return 5*Math.sqrt(Number(d.size)/Math.PI) }else{return 0}})
 //.style("fill", function(d) { return d._children ? x.options.color1 : d.level; }); 
 .style("fill", x.options.color1); 

nodeUpdate.select("text")
 .style("fill-opacity", 1);

// Transition exiting nodes to the parent's new position.
var nodeExit = node.exit().transition()
 .duration(duration)
 .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
 .remove();
nodeExit.select("circle")
 .attr("r", 1e-6);
nodeExit.select("text")
 .style("fill-opacity", 1e-6);

// Update the links.
var link = svg.selectAll("path.link")
 .data(links, function(d) { return d.target.id; })
 .style({"fill": "none", "stroke": x.options.color4, "stroke-width": "1.5px"});

// Enter any new links at the parent's previous position.
link.enter().insert("path", "g")
 .attr("class", "link")
 .attr("d", function(d) {
     var o = {x: source.x0, y: source.y0};
     return diagonal({source: o, target: o});
     })
 .style({"fill": "none", "stroke": x.options.color4, "stroke-width": "1.5px"});

// Transition links to their new position.
link.transition()
 .duration(duration)
 .attr("d", diagonal)
 .style({"fill": "none", "stroke": x.options.color4, "stroke-width": "1.5px"});

// Transition exiting nodes to the parent's new position.
link.exit().transition()
 .duration(duration)
 .style({"fill": "none", "stroke": x.options.color4, "stroke-width": "1.5px"})
 .attr("d", function(d) {
 var o = {x: source.x, y: source.y};
 return diagonal({source: o, target: o});
 })
 .remove();

// Stash the old positions for transition.
nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
    });

    }


// Toggle children on click.
var keep = 0;
function click(d) {
	console.log(d.icon)
    if (d.children) {
        d._children = d.children;
        d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
            }

var gs = svg.selectAll('g');
// what is the tallest point?
var keepHT = 0;
for (a = 0; a < gs[0].length; a++){
	k = gs[0][a].__data__.x0;
	if( k < keepHT){
		keepHT = k;
	}
}

update(d);


// How deep is the tree? 
var gs = svg.selectAll('g');

var keep = 0;
for (a = 0; a < gs[0].length; a++){
	k = gs[0][a].__data__.y0/225;
	if( k > keep & jQuery(gs[0][a]).is(':visible')){
		keep = k;
	}
}
// what is the tallest point?
var keepHT = 0;
for (a = 0; a < gs[0].length; a++){
	k = gs[0][a].__data__.x0;
	if( k < keepHT & jQuery(gs[0][a]).is(':visible')){
		keepHT = k;
	}
}


// Update the topbar text
var toptext = svg.selectAll("text.topbar")    
var textUpdate = toptext.transition()
 .duration(duration*1.5)
 .attr("y", keepHT - 20);

// update the topbar image */
var topimage = svg.selectAll("image.topbar")
var imageUpdate = topimage.transition()
 .duration(duration*1.5)
 .attr("y", keepHT - 40);
}


// How deep is the original tree? 
var gs = svg.selectAll('g');

var keep = 0;
for (a = 0; a < gs[0].length; a++){
	k = gs[0][a].__data__.y0/225;
	if( k > keep){
		keep = k;
	}
}
// What is the tallest point of the original tree?
var keepHT = 0;
for (a = 0; a < gs[0].length; a++){
	k = gs[0][a].__data__.x0;
	if( k < keepHT){
		keepHT = k;
	}
}

// Add the original text && the original arrows
var top_bar = x.options.top_bar.split(',') 
   for (aa = 0; aa < top_bar.length; aa++) {
		if(aa < (top_bar.length + 1)){
		   opac = "1"
	    }else{opac = ".33"}
    svg.append("text")
		.attr("class", "topbar")
        .attr("x", aa*225)             
        .attr("y", keepHT-20)
        .attr("text-anchor", "middle")
		.style({"fill": "blue", "font-size": "16px", "fill-opacity": opac})
        .text(top_bar[aa]);
	if(aa < (top_bar.length-1)){
		svg.append("image")
			.attr("class", "topbar")
			.attr("xlink:href", "http://www.clker.com/cliparts/c/5/2/7/11949946211230256684line_line_arrow_end.svg.hi.png")
			.attr("x", aa*225 + 112)
			.attr("y", (keepHT-40))
			.attr("width", "24px")
			.style({"fill-opacity": ".6"})
			.attr("height", "24px")};  
}		 

// Make div invisable for a short period of time
function showIt2() {
  document.getElementById("bigSVG").style.visibility = "visible";
}
setTimeout("showIt2()", 1000);
// Scroll the DIV element treeHolder into view 
var objDiv = document.getElementById("treeHolder");
$(document).ready(function(){
     $('div,treeHolder').animate({scrollTop: ((objDiv.scrollHeight/2)+keepHT - 50)}, 800); 

});

},
});


function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 0.7, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
		// console.log(words)
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
			console.log(tspan.text().length);
            if (tspan.node().getComputedTextLength() > width & (["(", "+", "-"].includes(word) || /^[a-zA-Z]+$/.test(word))
				| (tspan.text().length > 30 & word.length > 4)) { 
				//| tspan.node().getComputedTextLength() + 10 > width & word.length > 6) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", "1em")
                            .text(word);
            }
        }
    });
}

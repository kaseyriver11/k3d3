HTMLWidgets.widget({

  name: 'aCTR',
  type: 'output',

  initialize: function(d, width, height) {
     d3.select(d).append("svg")
      .attr("width", 100)
      .attr("height", 1);

    return d3.layout.tree();
  },
  resize: function(d, width, height) {
     d3.select(d).select("svg")
      .attr("width", x.options.WD*225+50) // must make it large enough to handle being closed and opening back up - NOT sure why this works
      .attr("height",x.options.HT*40);    // must make it large enough to handle being closed and opening back up - NOT sure why this works
  },

renderValue: function(d, x, instance) {


var margin = {top: 30, right: 20, bottom: 30, left: 120},
    width = (x.options.WD*225),
	height = Math.max((x.options.HT*21+60), 300); // minimum height of 800. 

var i = 0,
 duration = 750,
 root;

var maxdepth = x.options.HT // The maximum number of leaves in a single column - Calculated in R before loading data
var maxwidth = x.options.WD // The maximum number of branches deep in a single line - Calculated in R before loading data

var createSpace = Math.ceil(x.options.maxChar/28)*12
var hSeparationBetweenNodes = Math.max(((400/x.options.HT)-2), x.options.minimum_distance, createSpace); // if we have room - use it 
var vSeparationBetweenNodes = 2;
var height = Math.max((hSeparationBetweenNodes*x.options.HT+60), 300);

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
var svg = d3.selectAll('.col-sm-12 svg').remove(); // Only works with PG Application. They have set a specific DIV element. Call it by nam --- Else use: var svg = d3.select(d).select("svg");
    svg.selectAll("*").remove();
    svg.selectAll("rect.negative").remove()

var svg = d3.select(d).append("svg")
	.attr("id", "mainSVG")
	.attr("width",(width + 100))
	.attr("height", 600)
	.append("g")
	.style("align", "center")
	.attr("transform", "translate(" + 50 + "," + 50 + ")"); // Where does the visual start - 50 units to the left, 50 units down (to leave room for the top bar) 
    svg.selectAll("*").remove(); // REMOVE EXISTING

var flare = JSON.parse(x.data);
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

function update(source) {
	
	// This function will find how deep the tree is at a given point // 
	var duration = d3.event && d3.event.altKey ? 5000 : 500;
	// compute the new height
	var levelWidth = [1];
	var childCount = function(level, n) {
	if(n.children && n.children.length > 0) {
		if(levelWidth.length <= level + 1) levelWidth.push(0);
		levelWidth[level+1] += n.children.length;
		n.children.forEach(function(d) {
			childCount(level + 1, d);
			});
			}
			};
  childCount(0, root);  
	// Update the height of the tree
	var newHeight = Math.max(d3.max(levelWidth) * hSeparationBetweenNodes + 120, 420); // make sure we leave enough space with a minimum of 420 as the height
		tree = tree.size([newHeight, width]);
  
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
	  .attr("r", function(d) { return Math.sqrt(Number(1.5*d.size/x.options.maxsize))}) // update 
	  .style({"fill": function(d) { return d._children ? x.options.color3 : d.level}, "stroke": x.options.color3, "stroke-width":"1.5px"})
	  .style("fill", function(d) { if(d.icon == ""){return d._children ? x.options.color3 : d.level} else {return x.options.color2} });

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
	  .call(wrap,150); // Custom wrapping function to move text down as needed.
 
	// Transition nodes to their new position.
	var nodeUpdate = node.transition()
	 .duration(duration)
	 .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

	nodeUpdate.select("circle")
	 .attr("r", function(d) { return Math.sqrt(Number(1.5*d.size/x.options.maxsize))}) // UPDATE
	 .style("fill-opacity", function(d) { if(Math.sqrt((1.5*d.size/x.options.maxsize)) > 15) {return .6}else{return 1}}) 
	 .style("fill", x.options.color1)
	 .style("fill", function(d) { if(d.icon == ""){return d._children ? x.options.color3 : d.level}else{return x.options.color2} });

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
	// Make the SVG bigger if needed (or smaller) //
	document.getElementById('mainSVG').setAttribute("height", (newHeight+90));
    }

	

// Toggle children on click.
function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
            }

update(d);
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
        .attr("y", -20)
        .attr("text-anchor", "middle")
		.style({"fill": "blue", "font-size": "16px", "fill-opacity": opac})
        .text(top_bar[aa]);
	if(aa < (top_bar.length-1)){
		svg.append("image")
			.attr("class", "topbar")
			.attr("xlink:href", "https://cdn.pixabay.com/photo/2016/04/07/19/11/arrow-1314515_960_720.png")
			.attr("x", aa*225 + 112)
			.attr("y", -40)
			.attr("width", "24px")
			.style({"fill-opacity": ".6"})
			.attr("height", "24px")};  
}		 

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
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
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

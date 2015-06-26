HTMLWidgets.widget({

  name: 'CIT',

  type: 'output',

  initialize: function(d, width, height) {

     d3.select(d).append("svg")
      .attr("width", 2000)
      .attr("height", 2000);

    return d3.layout.tree();
  },
  
  resize: function(d, width, height, tree) {
     d3.select(d).select("svg")
      .attr("width", 2000)
      .attr("height", 2000);
  },

  renderValue: function(d, x, instance) {

var margin = {top: 50, right: 30, bottom: 30, left: 30},
	width = 960 - margin.left - margin.right,
//	height = 960 - margin.top - margin.bottom,
	barHeight = 20,
	barWidth = width * .8;

var i = 0,
duration = 400,
root;

var tree = d3.layout.tree()
.nodeSize([0, 20]);

var diagonal = d3.svg.diagonal()
.projection(function(d) { return [d.y, d.x]; });

// Remove the previous svg element 
	var svg = d3.select(d).select("svg");
		svg.selectAll("*").remove(); 

// You don't want the image in the body. 
// var svg = d3.select("body").append("svg")

	var svg = d3.select(d).append("svg")
		.attr("width", width + margin.left + margin.right)
	//	.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	svg.selectAll("*").remove(); // REMOVE EXISTING 

// Can't seem to get d3.json working, using JSON.parse instead
var flare = JSON.parse(x.data);
	flare.x0 = 0;
    flare.y0 = 0;
    update(root = flare);

function update(source) {
    
    // Compute the flattened node list. TODO use d3.layout.hierarchy.
    var nodes = tree.nodes(root);
	
	var svg = d3.select(d).select("svg");
		svg.selectAll("*").remove(); 
    
    var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom+500);
    
    d3.select("svg").transition()
    .duration(duration)
    .attr("height", height);
    
    d3.select(self.frameElement).transition()
    .duration(duration)
    .style("height", height + "px");

 
    // Compute the "layout".
    nodes.forEach(function(n, i) {
        n.x = i * barHeight;
    });
    
    // Update the nodes.
    var node = svg.selectAll("g.node")
    .data(nodes, function(d) { return d.id || (d.id = ++i); });
    
    var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
    .style("opacity", 1e-6);
    
    // Enter any new nodes at the parent's previous position.
    nodeEnter.append("rect")
    //.attr("y", barHeight / 2)  // Use this to move the bars down
    .attr("height", barHeight)
    .attr("width", barWidth)
		// The next line was originally in the CSS file - replaced here so that no CSS file is needed. 
    .style({'fill': color, 'cursor': 'pointer', 'fill-opacity': '.5', 'stroke': '#3182bd', 'stroke-width': '1.5px'})
    .on("click", click);
    
    nodeEnter.append("text")
    .attr("dy", 14)
    .attr("dx", 6.5)
		// The next line was originally in the CSS file - replaced here so that no CSS file is needed. 
	.style({'font': '10px sans-serif', 'pointer-events': 'none'})
    .text(function(d) { return d.name; });
    
    // Transition nodes to their new position.
    nodeEnter.transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
    .style("opacity", 1);
    
    node.transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
    .style("opacity", 1)
    .select("rect")
    .style("fill", color);
    
    // Transition exiting nodes to the parent's new position.
    node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
    .style("opacity", 1e-6)
    .remove();
    
    // Update the links.
    var link = svg.selectAll("path.link")
    .data(tree.links(nodes), function(d) { return d.target.id; });
    
    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
    var o = {x: source.x0, y: source.y0};
    return diagonal({source: o, target: o});
    })
		// The next line was originally in the CSS file - replaced here so that no CSS file is needed. 
	.style({'fill': 'none', 'stroke': '#9ecae1', 'stroke-width': '1.5px'})
    .transition()
    .duration(duration)
    .attr("d", diagonal);
    
    // Transition links to their new position.
    link.transition()
    .duration(duration)
    .attr("d", diagonal);
    
    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
    .duration(duration)
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
// "#c6dbef"
function color(d) {
    return d._children ? x.options.color1 : d.children ? x.options.color2 : x.options.color3;
}

  }

  

});

HTMLWidgets.widget({

  name: 'CTR',

  type: 'output',

  initialize: function(d, width, height) {

     d3.select(d).append("svg")
      .attr("width", 2)
      .attr("height", 2);

    return d3.layout.tree();
  },
  
  resize: function(d, width, height) {
     d3.select(d).select("svg")
      .attr("width", 2)
      .attr("height", 2);
  },

renderValue: function(d, x, instance) {

var margin = {top: 20, right: 120, bottom: 20, left: 120},
 width = 1800 - margin.right - margin.left,
 height = 800 - margin.top - margin.bottom;

var i = 0,
 duration = 750,
 root;

var tree = d3.layout.tree()
 .size([height, width]);

var diagonal = d3.svg.diagonal()
 .projection(function(d) { return [d.y, d.x]; });

// Remove the previous svg element 
var svg = d3.select(d).select("svg");
    svg.selectAll("*").remove();

// var svg = d3.select("body").append("svg") 
var svg = d3.select(d).append("svg")
 .attr("width", Math.max(width + margin.right + margin.left, x.options.width))
 .attr("height", Math.max(height + margin.top + margin.bottom, x.options.height))
 .append("g")
 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
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

root.children.forEach(collapse);
update(root);

d3.select(self.frameElement).style("height", "800px");

function update(source) {
	// Compute the new tree layout.
	var nodes = tree.nodes(root).reverse(),
	links = tree.links(nodes);

// Normalize for fixed-depth.
 nodes.forEach(function(d) { d.y = d.depth * 180; });

// Update the nodes.
var node = svg.selectAll("g.node")
 .data(nodes, function(d) { return d.id || (d.id = ++i); })
 .style("cursor", "pointer");

// Enter any new nodes at the parent's previous position.
var nodeEnter = node.enter().append("g")
 .attr("class", "node")
 .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
 .on("click", click);

nodeEnter.append("circle")
 .attr("r", 1e-6)
 .style({"fill": function(d) { return d._children ? x.options.color1 : x.options.color2}, "stroke": x.options.color3, "stroke-width":"1.5px"});

nodeEnter.append("text")
 .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
 .attr("dy", ".35em")
 .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
 .text(function(d) { return d.name; })
 .style({"font": "10px sans-serif", "fill-opacity": 1e-6});

// Transition nodes to their new position.
// Transition nodes to their new position.
var nodeUpdate = node.transition()
 .duration(duration)
 .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

nodeUpdate.select("circle")
 .attr("r", 4.5)
 .style("fill", function(d) { return d._children ? x.options.color1 : x.options.color2; });

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
},
});

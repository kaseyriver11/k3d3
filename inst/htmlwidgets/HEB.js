HTMLWidgets.widget({

  name: "HEB",

  type: "output",

  initialize: function(d, width, height) {

     d3.select(d).append("svg")
      .attr("width", 3000)
      .attr("height", 3000);

    return d3.layout.cluster();
  },
  // Quite useless - d3.layout.bundle does not have a size element as of 06/11/15
   resize: function(d, width, height, cluster) {

     d3.select(d).select("svg")
      .attr("width", 3000)
      .attr("height", 3000);

     // cluster.size([3000, 3000]).resume(); 
  },


 renderValue: function(d, x) {

	var diameter = x.options.diameter,
		radius = diameter / 2,
		innerRadius = radius - x.options.radiusreducer;
	
	// get the width and height
	var width = d.offsetWidth*1.3;
	var height = d.offsetHeight*1.5;

	// Work on the cluster layout settings
	var cluster = d3.layout.cluster()
		.size([x.options.degrees, innerRadius])
		.sort(null)
		.value(function(d) { return d.size; });
	// Set the bundle layout
	var bundle = d3.layout.bundle();

	// Work on the line radial (line that cuts through the center of a circle)
	var line = d3.svg.line.radial()
		.interpolate("bundle")
		.tension(.85)
		.radius(function(d) { return d.y; })
		.angle(function(d) { return d.x / 180 * Math.PI; });
	// Remove the previous svg element 
	var svg = d3.select(d).select("svg");
		svg.selectAll("*").remove(); 

	 var drag = d3.behavior.drag()
        .on("drag", function(d,i) {
            d.x += d3.event.dx
            d.y += d3.event.dy
            d3.select(this).attr("transform", function(d,i){
                return "translate(" + [ d.x,d.y ] + ")"
            })
        });
	
	// var svg = d3.select("body").append("svg") - WE DO NOT WANT IT IN THE BODY
	// Work on the settings for our HTML 
	var svg = d3.select(d).select("svg")
		.attr("width", width)
		.attr("height", height)
	.append("g")
		.attr("transform", "translate(" + (radius + 25) + "," + (radius + 25) + ")");
		//.call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom))
	svg.selectAll("*").remove();
	
		
	// CALL THE DATA, parse it out	
	var classes = JSON.parse(x.data); 
	// Initialize Nodes and Links
	var nodes = cluster.nodes(packageHierarchy(classes)),
		links = packageImports(nodes);
		
	// Draw links  
	var link = svg.selectAll(".link")
		.data(bundle(links))
		.enter().append("path")
		.each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
		.attr("class", "link")
		.attr("d", line);
		//.source.style("fill", "#007f62");
		
	// Draw nodes
	var  node = svg.selectAll(".node")
		.data(nodes.filter(function(n) { return !n.children; }))
		.enter().append("text")
		.attr("class", "node")
		.attr("dy", ".31em")
		.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
		.style("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
		.text(function(d) { return d.key; })
		.on("mouseover", mouseovered)
		.on("mouseout", mouseouted); 

// Zoom and drag functionality if ever needed. 
/*function zoom() {
  svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
} */


  
function mouseovered(d) {
  node
      .each(function(n) { n.target = n.source = false; });

  link
      .classed("link--target", function(l) { if (l.target === d) return l.source.source = true; })
      .classed("link--source", function(l) { if (l.source === d) return l.target.target = true; })
    .filter(function(l) { return l.target === d || l.source === d; })
      .each(function() { this.parentNode.appendChild(this); });

  node
      .classed("node--target", function(n) { return n.target; })
      .classed("node--source", function(n) { return n.source})
		
}

function mouseouted(d) {
  link
      .classed("link--target", false)
      .classed("link--source", false);

  node
      .classed("node--target", false)
      .classed("node--source", false);
}

d3.select(self.frameElement).style("height", diameter + "px");

// Lazily construct the package hierarchy from class names.
function packageHierarchy(classes) {
  var map = {};

  function find(name, data) {
    var node = map[name], i;
    if (!node) {
      node = map[name] = data || {name: name, children: []};
      if (name.length) {
        node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
        node.parent.children.push(node);
        node.key = name.substring(i + 1);
      }
    }
    return node;
  }
  
  classes.forEach(function(d) {
    find(d.name, d);
  }); 
  /*for (var index = 0; index < classes.length; index++) {
	  find (classes[index].name, classes[index]);
  } */
  
  return map[""];
}

// Return a list of imports for the given array of nodes.
function packageImports(nodes) {
  var map = {},
      imports = [];

  // Compute a map from name to node.
  nodes.forEach(function(d) {
    map[d.name] = d;
  });
  

  // For each import, construct a link from the source to target node.
  nodes.forEach(function(d) {
    if (d.imports) {
		if (typeof d.imports == 'string' || d.imports instanceof String)
			imports.push({source: map[d.name], target: d.imports});
		else
			d.imports.forEach(function(i) {
				imports.push({source: map[d.name], target: map[i]});
			});
	}
  });
  
  return imports;
}
}



});



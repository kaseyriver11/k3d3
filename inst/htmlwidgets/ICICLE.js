HTMLWidgets.widget({
	
  name: "ICICLE",
  type: "output",
  
  renderValue: function(d, x) {
	var width = x.options.width,
		height = x.options.height;
	
	var color = x.options.color;
	

	var svg = d3.select(d).append("svg")
		.attr("width", width)
		.attr("height", height);

	var partition = d3.layout.partition()
		.size([width, height])
		.value(function(d) { return d.size; });
		
	var formatComma = d3.format(",");

	var mousemove = x.options.mousemove;
	
	
	
	var mouseout = function() {
	  d3.select("#tooltip").classed("hidden", true);
	};

	var myjson = x.data;
	
	root = JSON.parse( myjson ); //add this line

	  var nodes = partition.nodes(root);
		  
	  svg.selectAll(".node")
		  .data(nodes)
		.enter().append("rect")
		  .attr("class", "node")
		  .attr("x", function(d) { return d.x; })
		  .attr("y", function(d) { return d.y; })
		  .attr("width", function(d) { return d.dx; })
		  .attr("height", function(d) { return d.dy; })
		  .style("fill", function(d) { return d.children ? color(d.name) : color(d.name); })
		  .on("mousemove",  mousemove)
		  .on("mouseout", mouseout);

	  svg.selectAll(".label")
		  .data(nodes.filter(function(d) { return d.dx > 6; }))
		.enter().append("text")
		  .attr("class", "label")
		  .attr("dy", ".35em")
		  .attr("transform", function(d) { return "translate(" + (d.x + d.dx / 2) + "," + (d.y + d.dy / 2) + ")"; })
		  .attr("transform", function(d) { return d.dx < 40 ? "translate(" + (d.x + d.dx / 2) + "," + (d.y + d.dy / 2) + ")rotate(90)": 
															  "translate(" + (d.x + d.dx / 2) + "," + (d.y + d.dy / 2) + ")"; }) 
		  .text(function(d) { return d.dx > 10 ? d.name: null; })
		  .on("mousemove",  mousemove)
		  .on("mouseout", mouseout);
	  
  }
});



HTMLWidgets.widget({
	
  name: "ICICLE",
  type: "output",
  
  renderValue: function(d, x) {
	  
	  // Remove the previous svg element 
	//var svg = d3.select(d).select("svg");
	//	svg.selectAll("*").remove(); 
	d3.select("svg").remove();
	
	var width = x.options.width,
		height = x.options.height;
	
	var color = x.options.color;
	
	var textcolor = x.options.textcolor;

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
	
	var onclick = function(d) {
	 Shiny.onInputChange("myclick", d.name);	
	}

	var myjson = x.data;
	
	root = JSON.parse( myjson ); //add this line

	  var nodes = partition.nodes(root);
		  
	  svg.selectAll(".node")
		  .data(nodes)
		.enter().append("rect")
		  .attr("class", "node2")
		  .attr("x", function(d) { return d.x; })
		  .attr("y", function(d) { return d.y; })
		  .attr("width", function(d) { return d.dx; })
		  .attr("height", function(d) { return d.dy; })
		  .style("fill", function(d) { return d.children ? color(d.name) : color(d.name); })
		  .on("mousemove",  mousemove)
		  .on("click", onclick);
		 /* .on("mouseout", mouseout); */
		  
	  svg.selectAll(".label")
		  .data(nodes.filter(function(d) { return d.dx > 6; }))
		.enter().append("text")
		  .attr("class", "label")
		  .attr("dy", ".35em")
		  .style("fill", textcolor)
		  .style("font-size",function(d) { return d.dx > 125 ? "24px": "12px";})
		  .attr("transform", function(d) { return "translate(" + (d.x + d.dx / 2) + "," + (d.y + d.dy / 2) + ")"; })
		  .attr("transform", function(d) { return d.dx < 125 ? "translate(" + (d.x + d.dx / 2) + "," + (d.y + d.dy / 2) + ")rotate(90)": 
															  "translate(" + (d.x + d.dx / 2) + "," + (d.y + d.dy / 2) + ")"; }) 
		  .text(function(d) { if(10 < d.dx & d.dx < 130) return d.name; /* d.name.substring(0,8)+'...' */ 
							  else return d.dx > 129 ? d.name: null; }) 
		  .on("mousemove",  mousemove)
		  .on("click", onclick);
		/*  .on("mouseout", mouseout); */
  }
});



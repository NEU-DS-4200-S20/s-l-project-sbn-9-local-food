function legend() {

let margin = {
    top: 12,
    left: 10,
    right: 6,
    bottom: 7
  },
  width = 150 - margin.left - margin.right,
  height = 50 - margin.top - margin.bottom,

let svg = d3.select(selector)
  .append("svg")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
    .classed("svg-content", true);


svg = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var legend = svg 
  .append("g")   .attr("class", "legend") 
  .attr("width", 140) 
  .attr("height", 200) 
  .selectAll("g") 
  .data([ 
    {'color': 'green', 'label': 'Does not have trade relationship'}, 
    {'color': 'blue', 'label': 'Does have trade relationship'} ]) 
    .enter() 
    .append("g") 
    .attr("transform", function(d, i) { 
      return "translate(0," + i * 20 + ")"; 
    });  legend 
    .append("rect") 
    .attr("width", 18) 
    .attr("height", 18) 
    .style("fill", function(d) { 
       return d.color   });  legend 
       .append("text") 
       .attr("x", 24) 
       .attr("y", 9) 
       .attr("dy", ".35em") 
       .text(function(d) { return d.label }); 
return legend
}

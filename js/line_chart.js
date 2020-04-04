/* global D3 */

// Initialize a line chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function linechart() {

  let margin = {
      top: 60,
      left: 50,
      right: 30,
      bottom: 35
    },
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    xValue = d => d[0],
    yValue = d => d[1],
    xLabelText = "Season",
    yLabelText = "Average Pallets Produced",
    yLabelOffsetPx = 0,
    xScale = d3.scalePoint(),
    yScale = d3.scaleLinear(),
    ourBrush = null,
    selectableElements = d3.select(null),
    dispatcher;


  // Create the chart by adding an svg to the div with the id 
  // specified by the selector using the given data

  function chart(selector, data) {

    let svg = d3.select(selector)
      .append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
        .classed("svg-content", true);


    svg = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    //Define scales
    xScale
      .domain(['Spring', 'Summer', 'Fall', 'Winter'])
      .rangeRound([0, width]);

    yScale.domain([(0), d3.max(data, function(c) {
    return d3.max(c.values, function(d) { 
        return d.pallets + 1; }); 
        })
    ])
    .rangeRound([height, 0]);


    // X axis
    let xAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height) + ")")
        .call(d3.axisBottom(xScale));
        
    // Put X axis tick labels 
    xAxis.selectAll("text") 
        .style("text-anchor", "end")
        .attr("dx", "1.25em")
        .attr("dy", "1em");
        
    // X axis label
    xAxis.append("text")        
        .attr("class", "axis")
        .attr("transform", "translate(" + (width - 50) + ",-10)")
        .text(xLabelText);
    
    // Y axis and label
    let yAxis = svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-90) translate(-150, -28)")
        //.attr("transform", "translate(" + yLabelOffsetPx + ", -12)")
        .style("text-anchor", "end")
        .text(yLabelText);

    const line = d3.line()
      .x(function(d) { return xScale(d.season);})
      .y(function(d) {return yScale(d.pallets); });

    let id = 0;
    const ids = function () {
      return "line-"+id++; 
    }


    const lines = svg.selectAll("lines")
      .data(data)
      .enter()
      .append("g");
      
      lines.append("path")
      .attr("class", ids)
      .attr("d", function(d) { 
        return line(d.values)}); 

      lines.append("text")
      .attr("class","serie_label")
      .datum(function(d) { 
          return {
              id: d.id, 
              value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { 
              return "translate(" + (xScale(d.value.season) - 65)  
              + "," + (yScale(d.value.pallets) + 15 ) + ")"; })
      .attr("x", 5)
      .text(function(d) { return d.id; });

    return chart;
  }

  // The x-accessor from the datum
  function X(d) {
    return xScale(xValue(d));
  }

  // The y-accessor from the datum
  function Y(d) {
    return yScale(yValue(d));
  }

  chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function (_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function (_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  chart.xLabel = function (_) {
    if (!arguments.length) return xLabelText;
    xLabelText = _;
    return chart;
  };

  chart.yLabel = function (_) {
    if (!arguments.length) return yLabelText;
    yLabelText = _;
    return chart;
  };

  chart.yLabelOffset = function (_) {
    if (!arguments.length) return yLabelOffsetPx;
    yLabelOffsetPx = _;
    return chart;
  };

  // Gets or sets the dispatcher we use for selection events
  chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
  };

  // Given selected data from another visualization 
  // select the relevant elements here (linking)
  chart.updateSelection = function (selectedData) {
    if (!arguments.length) return;

    // Select an element if its datum was selected
    selectableElements.classed("selected", d => {
      return selectedData.includes(d)
    });
  };

  return chart;
}


/* global D3 */

// Initialize a line chart
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
    yLabelText = "Average Pallets Produced by Vendors",
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
        .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom + 10].join(' '))
        .classed("svg-content", true);


    svg = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create an area around points to ease selection of data via mouse hover
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute");


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
        .attr("transform", "translate(" + (width / 2) + ",40)")
        .attr("class", "axis_label")
        .text(xLabelText);

    // Y axis and label
    let yAxis = svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-90) translate(-100, -35)")
        .style("text-anchor", "end")
        .attr("class", "axis_label")
        .text(yLabelText);

    // Create lines for chart
    const line = d3.line()
      .x(function(d) { return xScale(d.season);})
      .y(function(d) {return yScale(d.pallets); });

    // Dynamically compute values for lines (for CSS reference)
    let id = 0;
    const ids = function () {
      return "line-"+id++;
    }

    // add data to lines
    const lines = svg.selectAll("lines")
      .data(data)
      .enter()
      .append("g");

      lines.append("path")
      .attr("class", ids)
      .attr("d", function(d) {
        //console.log(d);
        return line(d.values)})
      .attr("id", function(d) {
        return d.id;
      });

    selectableElements = lines;

    // Add interactivity via mouse events
    let line_class = ""
    svg.selectAll("path")
    .on('mouseover', function() {
      line_class = this.getAttribute("class")
      const selection = d3.select(this).attr("class", "highlight_" + line_class.slice(-1))
    }).
    on('mousedown', function() {
      const selection = d3.select(this).attr("class", "lineSelected")
      //d3.selectAll('circle').selectAll("#yes").style("fill", "#FF0000")
      d3.select("#map").selectAll("#yes").style("fill", "#FF0000")

    }).
    on('mouseup', function() {
      let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
     // dispatcher.call(dispatchString, this, svg.selectAll(".lineSelected").data()[0]['id']);
    })
    .on('mouseout', function() {
    const selection = d3.select(this).attr("class", line_class)
    });

    // Added (invisible) points so that user can view values on mouseover
    lines.selectAll("points")
    .data(function(d) {return d.values})
    .enter()
    .append("circle")
    .attr("cx", function(d) { return xScale(d.season); })
    .attr("cy", function(d) { return yScale(d.pallets); })
    .attr("r", 8)
    .attr("class","point")

    lines.selectAll("circles")
    .data(function(d) { return(d.values); } )
    .enter()
    .append("circle")
    .attr("cx", function(d) { return xScale(d.season); })
    .attr("cy", function(d) { return yScale(d.pallets); })
    .attr('r', 10)
    .style("opacity", 0)
    .on('mouseover', function(d) {
        tooltip.transition()
    .duration(200)
    .delay(30)
    .style("opacity", 1)
    .style("color", "steelblue")
    .style("font-size", "110%")

        tooltip.html(d.pallets.toFixed(1))
    .style("left", (d3.event.pageX + 25) + "px")
    .style("top", (d3.event.pageY) + "px")})
    .on("mouseout", function(d) {
    tooltip.transition()
    .duration(200)
    .style("opacity", 0);
    });




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
    //console.log(selectedData)


    selectableElements.classed("barSelected", d => {
      if (d['id'] == selectedData.charAt(0).toUpperCase() + selectedData.substring(1)) {
       // console.log(d)
        return selectedData.includes(d)
      }
    });


  };

  return chart;
}

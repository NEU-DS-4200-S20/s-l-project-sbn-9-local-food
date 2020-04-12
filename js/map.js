/* global D3 */

// Initialize a spatial plot with an image background. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function map(opts={}) {

  // Based on Mike Bostock's margin convention
  // https://bl.ocks.org/mbostock/3019563
  let margin = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    width = 433, // change this to the screenshot's width
    height = 537, // change this to the screenshot's height
    xValue = d => d[0],
    yValue = d => d[1],
    xLabelText = "",
    yLabelText = "",
    yLabelOffsetPx = 0,
    xScale = d3.scaleLinear(),
    yScale = d3.scaleLinear(),
    //rScale = d3.scaleLinear(),
    ourBrush = null,
    selectableElements = d3.select(null),
    dispatcher;



  // Create the chart by adding an svg to the div with the id
  // specified by the selector using the given data
  function chart(selector, data) {

    let minX = d3.min(data, d => d.latitude),
        maxX = d3.max(data, d => d.latitude),
        minY = d3.min(data, d => d.longitude),
        maxY = d3.max(data, d => d.longitude)




    let svg = d3.select(selector)
      .append("svg")
        // .attr("width", "100%")
        .attr("width", width + "px")
        .attr("height", height + "px")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", [0, 0, width, height].join(' '))
        .classed("svg-content", true);

    if (opts['backgroundImage']) {
      svg.append('image')
        .attr('xlink:href', opts['backgroundImage'])
        .attr("width", width)
        .attr("height", height)
      // svg.attr('background-image', "url(" + opts['backgroundImage'] + ")");
    }

    svg = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


/*
     let Tooltip = d3.select(selector)
       .append("div")
       .attr("class", "tooltip")
       .style("min-height", "500px")
       .style("opacity", 1)
       .style("background-color", "white")
       .style("border", "solid")
       .style("border-width", "2px")
       .style("border-radius", "5px")
       .style("padding", "5px")*/

    //Define scales
    xScale
      .domain([
        d3.min(data, d => xValue(d)),
        d3.max(data, d => xValue(d))
      ])
      .rangeRound([0, width]);

    yScale
      .domain([
        d3.min(data, d => yValue(d)),
        d3.max(data, d => yValue(d))
      ])
      .rangeRound([height, 0]);



    // Add the points
    let points = svg.append("g")
      .selectAll(".scatterPoint")
      .data(data);



    points.exit().remove();


/*
    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      console.log("HIT")
      Tooltip.style("opacity", 1)
    }
    var addTooltip = function(d) {
       Tooltip
         .html("Zipcode: " + d.zipcode + "<br>" + "Food Types Produced: " + d.food)
         .style("left", (d3.mouse(this)[0]+10) + "px")
         .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function(d) {
      Tooltip.style("opacity", 0)
    }*/

    points = points.enter()
      .append("circle")
      .attr("class", "")
      .merge(points)
      .attr("cx", X)
      .attr("cy", Y)
      .attr("r", (d) => { return 5; })
      .attr("relation", (d) => { return d.relation})
      .attr("zipcode", (d) => { return d.zipcode})
      .attr("food", (d) => { return d.food})
      .attr("fill", (d) => {
        if(d.relation == "no") {
          return "green";
        } else {
          return "blue";
        }
      })
       .attr("opacity", 0.7);






    selectableElements = points;
     svg.call(brush);



    // Highlight points when brushed
    function brush(g) {

      const brush = d3.brush() // Create a 2D interactive brush
        .on("start brush", highlight) // When the brush starts/continues do...
        .on("end", brushEnd) // When the brush ends do...
        .extent([
          [-margin.left, -margin.bottom],
          [width + margin.right, height + margin.top]
        ]);

      ourBrush = brush;

      g.call(brush); // Adds the brush to this element

      // Highlight the selected circles
      function highlight() {
        if (d3.event.selection === null) return;
        const [
          [x0, y0],
          [x1, y1]
        ] = d3.event.selection;

        // If within the bounds of the brush, select it
        points.classed("selected", d =>

          x0 <= X(d) && X(d) <= x1 && y0 <= Y(d) && Y(d) <= y1

        )

        // Get the name of our dispatcher's event
        let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];

<<<<<<< HEAD
        // Let other charts know about our selection
        dispatcher.call(dispatchString, this, svg.selectAll(".selected").data()[0]['relation']);
=======
        if (svg.selectAll(".selected").data().length !== 0) {
          dispatcher.call(dispatchString, this, svg.selectAll(".selected").data()[0]['relation']);
        }
>>>>>>> 88502908492a400e3c9709444888b7b45ea856fc
      }

      function brushEnd(){

         if (!d3.event.selection) return;

            // programmed clearing of brush after mouse-up
            // ref: https://github.com/d3/d3-brush/issues/10
            d3.select(this).call(brush.move, null);

            var d_brushed =  d3.selectAll(".selected").data();

            // populate table if one or more elements is brushed
            if (d_brushed.length > 0) {
                clearTableRows();
                d_brushed.forEach(d_row => populateTableRow(d_row))
            } else {
                clearTableRows();
          }

        // We don't want infinite recursion
        if(d3.event.sourceEvent.type!="end"){

          d3.select(this).call(brush.move, null);
        }
      }


      function clearTableRows() {

            hideTableColNames();
            d3.selectAll(".row_data").remove();
      }

      function hideTableColNames() {
          d3.select("table").style("visibility", "hidden");
      }

      function showTableColNames() {
          d3.select("table").style("visibility", "visible");
      }

      function populateTableRow(d_row) {

            showTableColNames();

            var d_row_filter = [d_row.zipcode,
                               d_row.food,
                                d_row.relation];

            d3.select("table")
              .append("tr")
              .attr("class", "row_data")
              .selectAll("td")
              .data(d_row_filter)
              .enter()
              .append("td")
              .attr("align", (d, i) => i == 0 ? "left" : "right")
              .text(d => d);
      }


    }

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
       // console.log(yValue)

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
    console.log(selectedData);
    // Select an element if its datum was selected
<<<<<<< HEAD
    selectableElements.classed("selected", d => {
=======
>>>>>>> 88502908492a400e3c9709444888b7b45ea856fc


    selectableElements.classed("selected", d => {
      if (d['relation'] == selectedData.toLowerCase()) {
        console.log(d)
        return selectedData.includes(d)
      }
    });

  };

  return chart;
}

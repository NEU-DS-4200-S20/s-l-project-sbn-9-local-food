/* global D3 */

function table() {

  // Based on Mike Bostock's margin convention
  // https://bl.ocks.org/mbostock/3019563
  let ourBrush = null,
    selectableElements = d3.select(null),
    dispatcher;

  // Create the chart by adding an svg to the div with the id 
  // specified by the selector using the given data
  function chart(selector, data) {
    let table = d3.select(selector)
      .append("table")
        .classed("my-table", true);

    // Here, we grab the labels of the first item in the dataset
    //  and store them as the headers of the table.
    let tableHeaders = Object.keys(data[0]);

    // You should append these headers to the <table> element as <th> objects inside
    // a <th>
    // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table

    // YOUR CODE HERE
    let tr = table.append("tr");
    tr.selectAll("th").data(tableHeaders).enter().append("th").text( function (tableHeaders) { return tableHeaders; });


    // Then, you add a row for each row of the data.  Within each row, you
    // add a cell for each piece of data in the row.
    // HINTS: For each piece of data, you should add a table row.
    // Then, for each table row, you add a table cell.  You can do this with
    // two different calls to enter() and data(), or with two different loops.

    // YOUR CODE HERE

    let thead = table.append("thead");
        let header = thead.append("tr")
          .selectAll("th")
          .data(tableHeaders)
          .enter()
          .append("th")

     tbody = table.append("tbody");
    let rows = tbody.selectAll("tr")
      .data(data)
      .enter()
      .append("tr");

    let cells = rows.selectAll("td")
      .data(function(row) {
        return tableHeaders.map(function(d, i) {
          return {i: d, value: row[d]};
        });
      })
      .enter()
      .append("td")
      .html(function(d) { return d.value;});



    // Then, add code to allow for brushing.  Note, this is handled differently
    // than the line chart and scatter plot because we are not using an SVG.
    // Look at the readme of the assignment for hints.
    // Note: you'll also have to implement linking in the updateSelection function
    // at the bottom of this function.
    // Remember that you have to dispatch that an object was highlighted.  Look
    // in linechart.js and scatterplot.js to see how to interact with the dispatcher.

    // HINT for brushing on the table: keep track of whether the mouse is down or up, 
    // and when the mouse is down, keep track of any rows that have been mouseover'd

    // YOUR CODE HERE

    table.call(brush);
    table.call(updateMouseLocation);

    // Unhilight all rows of table if a click was detected outside the table
    d3.select("body").on("mousedown", () => {shouldUnhighlight()});

    let dragItems = null;
    let hoverItems = null;
    let deselect = false;
    let mouseInsideTable = false; 

    // trigger brushing when mouse events are detected
    function brush(d, i) {
      d3.selectAll("tr").on("mousedown", function(d, i, elements) {brushStart(event, d, i, elements)})
        .on("mousemove", function(d, i, elements) {brushDrag(event, d, i, elements)})
        .on("mouseup", function(d, i) {brushStop(event)})
    };

    // set the location of the mouse to inside or outside the table
    function setMouseLocation(location) {
      mouseInsideTable = location;
    }

    // determine whether mouse is inside table element or not
    function updateMouseLocation(d, i) {
      d3.select("table").on("mouseenter", () => {setMouseLocation(true)})
      .on("mouseleave", () => {setMouseLocation(false)})
    }

    // deselect rows if the mouse was clicked outside the table
    function shouldUnhighlight() {
      if(!mouseInsideTable) {
        table.selectAll("tr").classed("selected", false)

        let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
        dispatcher.call(dispatchString, this, table.selectAll(".selected").data());
      }
    }

    // highlight the selected elements on mousedown and update other charts
    function brushStart(event, d, i, elements) {
      dragItems = event.target;
      focusElements = d3.select(elements[i]);
      deselect = !focusElements.classed("selected");
      focusElements.classed("selected", deselect);

      let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
      dispatcher.call(dispatchString, this, table.selectAll(".selected").data());
    };

    // continue selecting elements on dragging brush and update other charts
   function brushDrag(event, d, i, elements){
      hoverItems = event.target;
      if (dragItems){
          d3.select(elements[i])
              .classed("selected", deselect);
      }

      let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
      dispatcher.call(dispatchString, this, table.selectAll(".selected").data());
    };

    // stop highlighting when mouse is released
    function brushStop(event, d, i){
        dragItems = null;
    };

    return chart;
  }

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
    d3.selectAll('tr').classed("selected", d => {
      return selectedData.includes(d)
    });
  };

  return chart;
}
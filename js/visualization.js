
((() => {

  // Load the data from a CSV file
  d3.csv("data/map_data.csv", (data) => {

    // Create a spatial plot given a background image,
    // x and y attributes, 
    // a div id selector to put our svg in; and the data to use.
    let spatialPlot = spatial({
        'backgroundImage': 'x.png' //add image soon
      })
      .x(d => +d.Longitude)
      .y(d => +d.Latitude)
      ("#spatial", data);
  });

  d3.csv("data/barchart_data.csv", (data) => {
    let barchart = barchart()
      .x(d => d["Does your company currently have a trade relationship with a buyer?"])
      .xLabel("Has Trade Relationship")
      .y(d => d["Percent Change in Desired Wholesaling"])
      .yLabel("Change in Desired Wholesaling (%)")
      .yLabelOffset(100)
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#barchart", data);
  });

  d3.csv("data/linechart_data.csv", (data) => {
    const dispatchString = "selectionUpdated";
    let linechart = linechart()
      .x(["Spring","Summer","Fall","Winter"])
      .xLabel("Season")
      .y(d => d["Spring Capable Volume","Summer Capable Volume","Fall Capable Volume","Winter Capable Volume"])
      .yLabel("Pallets Produced")
      .yLabelOffset(40)
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#linechart", data);
      // need to make a function that aggregates based on boolean
      // more research


    // When the line chart selection is updated via brushing, 
    // tell the scatterplot to update it's selection (linking)
    barchart.selectionDispatcher().on(dispatchString, function(selectedData) {
      linechart.updateSelection(selectedData);
      // ADD CODE TO HAVE TABLE UPDATE ITS SELECTION AS WELL
      spatialPlot.updateSelection(selectedData);
    });

    // When the scatterplot selection is updated via brushing, 
    // tell the line chart to update it's selection (linking)
    linechart.selectionDispatcher().on(dispatchString, function(selectedData) {
      barchart.updateSelection(selectedData);
      // ADD CODE TO HAVE TABLE UPDATE ITS SELECTION AS WELL
      spatialPlot.updateSelection(selectedData);
    });

    // When the table is updated via brushing, tell the line chart and scatterplot
    // YOUR CODE HERE
    spatialPlot.selectionDispatcher().on(dispatchString, function(selectedData) {
      linechart.updateSelection(selectedData);
      barchart.updateSelection(selectedData);
    });
  });

})());

let data_relation = [];
let data_norelation = [];

let map_data = [];
let barchart_data = [];
let bar_relation = [];
let bar_norelation = [];
let linechart_data = []; 
let line_relation = [];
let line_norelation = [];


((() => {

	d3.csv("data/data.csv", (data) => {

	    const dispatchString = "selectionUpdated";


		// convert strings to numbers unless "Not Applicable"
		// add 0 to each zipcode 
		data.forEach(function(d) {
			d["Mailing Address (Zip Code)"] = "0" + d["Mailing Address (Zip Code)"] ;
			d["Latitude"] = +d["Latitude"]; 
			d["Longitude"] = +d["Longitude"]; 


			if(d["Spring Capable Volume"] !== "Not Applicable") {
				d["Spring Capable Volume"] = +d["Spring Capable Volume"];
			}
			if(d["Summer Capable Volume"] !== "Not Applicable") {
				d["Summer Capable Volume"] = +d["Summer Capable Volume"];
			}
			if(d["Fall Capable Volume"] !== "Not Applicable") {
				d["Fall Capable Volume"] = +d["Fall Capable Volume"];
			}
			if(d["Winter Capable Volume"] !== "Not Applicable") {
				d["Winter Capable Volume"] = +d["Winter Capable Volume"];
			}
			if(d["Approximately what percentage of your products do you currently sell wholesale?"] !== "Not Applicable") {
				d["Approximately what percentage of your products do you currently sell wholesale?"] = +d["Approximately what percentage of your products do you currently sell wholesale?"];
			}
			if(d["Do you have a goal for what percentage of your products you would like to sell wholesale?"] !== "Not Applicable") {
				d["Do you have a goal for what percentage of your products you would like to sell wholesale?"] = +d["Do you have a goal for what percentage of your products you would like to sell wholesale?"];
			}
			if(d["Percent Change in Desired Wholesaling"] !== "Not Applicable") {
				d["Percent Change in Desired Wholesaling"] = +d["Percent Change in Desired Wholesaling"];
			}


		});

		// split data based on whether vendor has trade relation or not
		data.forEach(function(row, i, arr) {
			if(row["Does your company currently have a trade relationship with a buyer?"] == "no") {
				data_norelation.push(row);
			} else {
				data_relation.push(row);
			}
		});

	
		// Add the data set of for vendors with and without relation
		linechart_data["relation"] = parseLineChartData(data_relation);
		linechart_data["norelation"] = parseLineChartData(data_norelation);		
		


		let lcSeasonProduction = linechart()


		// parseBarChartData(data);
		// parseMapData(data);



	});

})());

function parseLineChartData(data) {

	let tempArr = [];

	let springTotal = 0;
	let springVendorCount = 0;
	let springAverage;

	let summerTotal = 0;
	let summerVendorCount = 0;
	let summerAverage;

	let fallTotal = 0;
	let fallVendorCount = 0;
	let fallAverage;

	let winterTotal = 0; 
	let winterVendorCount = 0; 
	let winterAverage; 

	data.forEach(function(row, i, arr) {
		let springValue = row["Spring Capable Volume"];
		let summerValue = row["Summer Capable Volume"];
		let fallValue = row["Fall Capable Volume"];
		let winterValue = row["Winter Capable Volume"];

		if(springValue !== "Not Applicable") {
			springTotal += springValue;
			springVendorCount++; 
		}
		if(summerValue !== "Not Applicable") {
			summerTotal += summerValue;
			summerVendorCount++;
		}
		if(fallValue !== "Not Applicable") {
			fallTotal += fallValue;
			fallVendorCount++;
		}
		if(winterValue !== "Not Applicable") {
			winterTotal += winterValue;
			winterVendorCount++;
		}
	});

	springAverage = springTotal / springVendorCount;
	summerAverage = summerTotal / summerVendorCount;
	fallAverage = fallTotal / fallVendorCount;
	winterAverage = winterTotal / winterVendorCount; 

	averages = [springAverage, summerAverage, fallAverage, winterAverage];
	seasons = ["Spring", "Summer", "Fall", "Winter"];

	averages.forEach(function(d, i) {
		tempArr.push({
			season: seasons[i],
			pallets: d
		});
	});

	return tempArr; 
}


/*((() => {

  // Load the data from a CSV file
  d3.csv("data/map_data.csv", (data) => {

//we switched the x and y coordinates when inputting the longitude/latitude
// proper: (-70.609,41.451,-72.963,43.617)
    // Create a spatial plot given a background image,
    // x and y attributes, 
    // a div id selector to put our svg in; and the data to use.
    let spatialPlot = spatial({
        'backgroundImage': 'local_map.png' //add image soon
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

})());*/
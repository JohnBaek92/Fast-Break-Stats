const d3 = require("d3");

let render = document.addEventListener("DOMContentLoaded", function() {
  d3.json("data/start_data.json", function(error, data) {
      let width = 790;
      let height = 590;
      let xAxisVal = d3.select(".x-selector").property("value");
      let yAxisVal = d3.select(".y-selector").property("value");

      let xScale = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d[xAxisVal]}))
      .range([10, width - 50]);

      let yScale = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d[yAxisVal]}))
      .range([height - 50, 10]);
      
      let xAxis = d3.axisBottom().scale(xScale);
      let yAxis = d3.axisLeft().scale(yScale);
      let chart = d3.select("#chart")
                    .append("g")
                    .attr("transform", "translate(50)")

    chart.append("g")
    .attr("transform", `translate(0, 580)`).call(xAxis);

    chart.append("g")
    .attr("transform", `translate(0)`).call(yAxis);

      

    let circles = chart
      .selectAll("circle")
      .data(data)
      .enter()
        .append("circle");
    
    let circleAttrs = circles
      .attr("cx", function(d) {
        return xScale(d[xAxisVal]);
      })
      .attr("cy", function(d) {
        return yScale(d[yAxisVal]);
      })
      .attr("r", 10)
      .style("fill", function(d) {
          return colorPicker(d);
      });
  });
});

let colorPicker = function(d) {
    switch(d["position"]) {
        case "PG":
            return "red";
            break;
        case "SG":
            return "blue";
            break;
        case "SF":
            return "green";
            break;
        case "PF":
            return "purple";
            break;
        case "C":
            return "orange";
        default: 
            return "black";        
    }
};
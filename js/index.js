const d3 = require("d3");

let render = document.addEventListener("DOMContentLoaded", function() {
  d3.json("data/start_data.json", function(error, data) {
    let chart = d3.select("#chart");
    let width = 800;
    let height = 600;
    let xAxisVal = d3.select(".x-selector").property("value");
    let yAxisVal = d3.select(".y-selector").property("value");
    let xScale = d3.scaleLinear()
                  .domain(d3.extent(data, function(d) { return d[xAxisVal]}))
                  .range([10, width]);
    let yScale = d3.scaleLinear()
                  .domain(d3.extent(data, function(d) { return d[yAxisVal]}))
                  .range([10, height]);

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
      .attr("r", 5)
      .style("fill", "red");
  });
});
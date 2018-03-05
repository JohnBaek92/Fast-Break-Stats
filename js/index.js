const d3 = require("d3");

document.addEventListener("DOMContentLoaded", function() {
  d3.json("data/start_data.json", function(error, data) {
    let chart = d3.select("#chart")

      let circles = chart.selectAll("circle")
          .data(data)
          .enter()
              .append("circle");

      let circleAttrs = circles        
              .attr("cx", function(d) { return d.age})
              .attr("cy", function(d) { return d.minutes })
              .attr("r", 5)
              .style("fill", "red")
  });
});

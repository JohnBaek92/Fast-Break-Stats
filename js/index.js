const d3 = require("d3");
//modify d3
d3.selection.prototype.moveToFront = function() {
  return this.each(function() {
    this.parentNode.appendChild(this);
  });
};

const renderData = () => {
  d3.json("data/start_data.json", function(error, data) {
    const width = 790;
    const height = 590;
    let xAxisVal = d3.select(".x-selector").property("value");
    let yAxisVal = d3.select(".y-selector").property("value");

    let xScale = d3
      .scaleLinear()
      .domain(
        d3.extent(data, function(d) {
          return d[xAxisVal];
        })
      )
      .range([10, width - 50]);

    let yScale = d3
      .scaleLinear()
      .domain(
        d3.extent(data, function(d) {
          return d[yAxisVal];
        })
      )
      .range([height - 50, 10]);

    let xAxis = d3.axisBottom().scale(xScale);
    let yAxis = d3.axisLeft().scale(yScale);
    let chart = d3
      .select("#chart")
      .append("g")
      .attr("transform", "translate(50, 10)");

    chart
      .append("g")
      .attr("transform", `translate(0, 560)`)
      .call(xAxis);

    chart
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${width/2}, 600)`)
      .text(xAxisVal); 

    chart
      .append("g")
      .attr("transform", `translate(-5)`)
      .call(yAxis);

    let tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

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
      .attr("r", 8)
      .attr("name", function(d) {
        return d["name"];
      })
      .style("fill", function(d) {
        return colorPicker(d);
      })
      .style("opacity", 0.7)
      .on("mouseover", function(d) {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip
          .html(`<img src=https://d2cwpp38twqe55.cloudfront.net/req/201802231/images/players/` + d["name"].split(" ")[1].slice(0,5).toLowerCase() + d["name"].split(" ")[0].slice(0,2).toLowerCase() + "01.jpg" + ">" + "<br/>" + d["name"] + "<br/>" + d[xAxisVal] + ` ${xAxisVal}` + "<br/>" + d[yAxisVal] + ` ${yAxisVal}`)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", function(d) {
        tooltip
          .transition()
          .duration(500)
          .style("opacity", 0);
      });
  });
};

const removeData = function() {
    let circles = d3.selectAll("circle");
    circles.remove();
    let scales = d3.selectAll("g");
    scales.remove();
    renderData();
};

const colorPicker = function(d) {
  switch (d["position"]) {
    case "PG":
      return "red";
    case "SG":
      return "blue";
    case "SF":
      return "green";
    case "PF":
      return "purple";
    case "C":
      return "orange";
    default:
      return "black";
  }
};

const highlightPlayer = () => {
    let selectedPlayer = d3.select(".highlight").property("value").toLowerCase();
    if(selectedPlayer === "") { return; }
    let circles = d3.selectAll("circle");
    circles.each(function(circle){
        if(circle.name.toLowerCase().indexOf(selectedPlayer) !== -1){
            let that = d3.select(this);
            that.moveToFront();
            that.attr("stroke-width", 50)
                .attr("stroke", "#ff00cb")
                .style("opacity", 1);
        } else {
            d3.select(this).style("opacity", 0.3);
        }
    });
};

const reRenderData = function () {
    removeData();
    renderData();
};

document.addEventListener("DOMContentLoaded", renderData);
document.querySelector(".highlight").addEventListener("change", highlightPlayer);
document.querySelector(".x-selector").addEventListener("change", reRenderData);
document.querySelector(".y-selector").addEventListener("change", reRenderData);

export default renderData;
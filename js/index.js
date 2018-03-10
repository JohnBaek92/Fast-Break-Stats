const d3 = require("d3");
const _ = require("lodash");
//modify d3
d3.selection.prototype.moveToFront = function() {
  return this.each(function() {
    this.parentNode.appendChild(this);
  });
};

let rScale;
let watchList = [];

const filter = function() {
  let pgFilter = d3.select(".one").property("checked");
  let sgFilter = d3.select(".two").property("checked");
  let sfFilter = d3.select(".three").property("checked");
  let pfFilter = d3.select(".four").property("checked");
  let cFilter = d3.select(".five").property("checked");
  let teamFilter = d3.select(".team-filter").property("value");
  let circles = d3.selectAll("circle");
  circles.each(function(circle) {
    let that = d3.select(this);
    let position = circle.position;
    if (!teamFilter.includes(circle.team) && teamFilter !== "ALL") {
      that.attr("class", "hidden");
    } else {
      if (pgFilter && position === "PG") {
        that.attr("class", "initial");
      } else if (sgFilter && position === "SG") {
        that.attr("class", "initial");
      } else if (sfFilter && position === "SF") {
        that.attr("class", "initial");
      } else if (pfFilter && position === "PF") {
        that.attr("class", "initial");
      } else if (cFilter && position === "C") {
        that.attr("class", "initial");
      } else {
        that.attr("class", "hidden");
      }
    }
  });
};

const renderData = () => {
  let currentSeason = Number(d3.select(".year").property("value"));
  d3.json(`data/json/${currentSeason}.json`, function(error, data) {
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

    rScale = d3
      .scaleLinear()
      .domain(
        d3.extent(data, function(d) {
          return d["minutes"] / d["games"];
        })
      )
      .range([2, 30]);

    let xAxis = d3.axisBottom().scale(xScale);
    let yAxis = d3.axisLeft().scale(yScale);
    let chart = d3
      .select("#chart")
      .append("g")
      .attr("transform", "translate(80, 32.5)");

    chart
      .append("g")
      .attr("transform", `translate(0, 560)`)
      .call(xAxis);

    chart
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${width / 2 - 20}, 600)`)
      .text(xAxisVal);

    chart
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(-45, ${height / 2 - 20})rotate(-90)`)
      .text(yAxisVal);

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
      .attr("r", function(d) {
        return rScale(d["minutes"] / d["games"]);
      })
      .attr("name", function(d) {
        return d["name"];
      })
      .style("fill", function(d) {
        return colorPicker(d);
      })
      .style("opacity", 0.5)
      .on("mouseover", function(d) {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0.9);
        tooltip
          .html(
            `<img src=https://d2cwpp38twqe55.cloudfront.net/req/201802231/images/players/` +
              d["name"]
                .split(" ")[1]
                .slice(0, 5)
                .toLowerCase() +
              d["name"]
                .split(" ")[0]
                .slice(0, 2)
                .toLowerCase() +
              "01.jpg" +
              ">" +
              "<br/>" +
              d["name"] +
              "<br/>" +
              d["team"] +
              "&nbsp;" +
              currentSeason +
              "&nbsp;" +
              d["position"] +
              "<br/>" +
              d[xAxisVal] +
              ` ${xAxisVal}` +
              "<br/>" +
              d[yAxisVal] +
              ` ${yAxisVal}` +
              "<br/>" +
              "~" +
              Math.floor(d["minutes"] / d["games"]) +
              " avg minutes"
          )
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 85 + "px");
      })
      .on("mouseout", function(d) {
        tooltip
          .transition()
          .duration(500)
          .style("opacity", 0);
      });

    filter();
  });
};

const removeData = function() {
  let circles = d3.selectAll("circle");
  circles.remove();
  let scales = d3.selectAll("g");
  scales.remove();
};

const colorPicker = function(d) {
  switch (d["position"]) {
    case "PG":
      return "#B13019";
    case "SG":
      return "#5C14C8";
    case "SF":
      return "#4FD764";
    case "PF":
      return "#F8AC47";
    case "C":
      return "#08D1C0";
    default:
      return "black";
  }
};

const highlightPlayer = e => {
  debugger
  let selectedPlayer = d3
    .select(".highlight")
    .property("value")
    .toLowerCase();
  if (selectedPlayer === "") {
    return;
  }
  d3
    .select(".highlighted-players")
    .append("option")
    .attr("class", "watching")
    .text(selectedPlayer);
  watchList.push(selectedPlayer);
  let circles = d3.selectAll("circle");
  circles.each(function(circle) {
    let that = d3.select(this);
    let radius = that.attr("r");
    that
      .style("opacity", 0.3)
      .attr("r", function(d) {
        return rScale(d["minutes"] / d["games"]);
      })
      .attr("stroke-width", 0)
      .attr("stroke", colorPicker(circle));
    watchList.forEach(function(player) {
      debugger
      if (
        circle.name.toLowerCase().indexOf(player) !== -1
      ) {
        that
          .attr("stroke-width", 3)
          .attr("r", function(d) {
            return rScale(d["minutes"] / d["games"]);
          })
          .style("fill", colorPicker(circle))
          .style("stroke", "black")
          .style("opacity", 1);
        that.moveToFront();
      } 
    });
  });
  e.target.value = "";
};

const removeHighlight = function () {
  let player = d3.select(".highlighted-players").property("value");
  let playerIdx = watchList.indexOf(player);
  watchList.splice(playerIdx, 1);
  let players = d3.selectAll(".watching");
  players.each(function(d, i){
    if(this.value === player){
      this.remove();
      highlightPlayer();
      debugger
    }
  });
};

const resetHighlight = function(e) {
  let reset = e["type"] === "click" || false;
  let circles = d3.selectAll("circle");
  if (reset) {
    circles.each(function(circle) {
      let that = d3.select(this);
      that
        .attr("stroke-width", 0)
        .attr("r", function(d) {
          return rScale(d["minutes"] / d["games"]);
        })
        .style("opacity", 0.5);
    });
  }
  let players = d3.selectAll(".watching");
  players.each(function(player) {
    this.remove();
  });
  watchList = [];
};

const reRenderData = function() {
  removeData();
  renderData();
};

document.addEventListener("DOMContentLoaded", renderData);
document
  .querySelector(".highlight")
  .addEventListener("change", highlightPlayer);
document.querySelector(".x-selector").addEventListener("change", reRenderData);
document.querySelector(".y-selector").addEventListener("change", reRenderData);
document.querySelector(".team-filter").addEventListener("change", reRenderData);
document.querySelector(".pos-filter").addEventListener("change", reRenderData);
document
  .querySelector(".reset-button")
  .addEventListener("click", resetHighlight);
document
  .querySelector(".remove-button")
  .addEventListener("click", removeHighlight);
document
  .querySelector(".season-filter")
  .addEventListener("change", reRenderData);

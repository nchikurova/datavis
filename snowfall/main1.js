const margin = { left: 100, right: 10, bottom: 100, top: 10 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

let flag = true;
let newData;
let currentData;
let dataIkon;
let dataEpic;
let interval;

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

const g = svg
  .append("g")
  .attr("transform", `translate (${margin.left}, ${margin.top})`);

// TOOPTIP
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const tip = d3
  .tip()
  .attr("class", "d3-tip")
  .html((d) => {
    let text = `<strong>Location: </strong><span 
    style='color':'black'>${capitalizeFirstLetter(d.location)}</span><br>`;
    text += `
    <strong>Resort: </strong><span>${d.resort}</span><br>`;
    text += `
    <strong>Total Snowfall in inches: </strong><span>${d.unit_inch}</span><br>
    `;
    text += `
    <strong>Pass: </strong><span>${d.pass}</span><br>
    `;
    text += `
    <strong>Season of: </strong><span>${d.year}</span><br>
    `;
    return text;
  });
g.call(tip);

// LABELS
// X label
const xLabel = g
  .append("text")
  .attr("class", "x axis-label")
  .attr("x", width / 2)
  .attr("y", height + 70)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Location");

// Y label
const yLabel = g
  .append("text")
  .attr("class", "y axis-label")
  .attr("transform", "rotate(-90)")
  .attr("x", -150)
  .attr("y", -40)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Total Snowfall per Season (inch)");

// SCALES

const x = d3.scaleBand().range([0, width]).paddingInner(0.3).paddingOuter(0.2);

const y = d3.scaleLinear().range([height, 0]);

const colorScale = d3.scaleOrdinal().range(["#cc6711", "#092340"]);

// X Axis
const xAxisCall = d3.axisBottom(x); //.tickFormat(d3.format("d"));

g.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0,${height})`)
  .call(xAxisCall)
  .selectAll("text")
  .attr("y", "10")
  .attr("x", "-5")
  .attr("text-anchor", "end")
  .attr("transform", "rotate(-40)");

// y axis

const yAxisCall = d3.axisLeft(y);

// LEGENDS
const passTypes = ["Epic", "Ikon"];

const legend = g
  .append("g")
  .attr("transform", `translate(${width - 10}, ${height - 125})`);

passTypes.forEach((passType, i) => {
  const legendRow = legend
    .append("g")
    .attr("transform", `translate(0, ${i * 20})`);

  legendRow
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", colorScale(passType));

  legendRow
    .append("text")
    .attr("x", -10)
    .attr("y", 10)
    .attr("text-anchor", "end")
    .style("text-transform", "capitalize")
    .text(passType);
});

// LOADING DATA
d3.csv("../data/annualsnowF2.csv").then(function (data) {
  data.forEach((d) => {
    d.snowfalldays = Number(d["Snowfall Days"]);
    d.unit_inch = +d.unit_inch;
    d.pass = d["Pass"];
    d.location = d["Location"];
    d.resort = d["Resort"];
    //const formatTime = d3.timeFormat("%b %d, %Y");
    // d.year = new Date(d.year);
    d.year = +d.year;
  });
  console.log(data);
  const newData = data.filter((d) => d.resort == "Killington"); //d.year == 2021);
  console.log(newData);
  y.domain([0, d3.max(newData, (d) => d.unit_inch)]);
  console.log(y.domain());
  x.domain([d3.extent(newData, (d) => d.year)]);
  console.log(x.domain());

  g.append("g")
    .attr("class", "y axis")
    .transition()
    .duration(2000)
    .call(yAxisCall);

  const circles = g.selectAll("circle").data(newData, (d) => d.resort);
  // EXIT old elements not present in new data
  circles
    .exit()
    .attr("fill", "grey")
    .transition(10000)
    .attr("cy", y(0))
    .remove();
  // ENTER new elements present in new data.

  circles
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("fill", (d) => colorScale(d.pass))
    .attr("stroke", "white")
    //.attr("cy", y(0))
    .attr("r", 6)
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide)
    // and update old elements present in new data
    .merge(circles)
    .transition(5000)
    .attr("cy", (d) => y(d.unit_inch))
    .attr("cx", (d) => x(d.year) + x.bandwidth());
});

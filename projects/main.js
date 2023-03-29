/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    2.4 - Adding SVGs with D3
 */

// const svg = d3.select("#chart-area").append("svg")
//   .attr("width", 400)
//   .attr("height", 400)

// svg.append("circle")
//   .attr("cx", 100)
//   .attr("cy", 250)
//   .attr("r", 70)
//   .attr("fill", "red")
const data = [25, 20, 10, 12, 15];

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", 400)
  .attr("height", 400);

const circles = svg.selectAll("circle").data(data);

circles
  .enter()
  .append("circle")
  .attr("cx", 100)
  .attr("cy", 250)
  .attr("r", 70)
  .attr("fill", "red");

// svg
//   .append("rect")
//   .attr("x", 20)
//   .attr("y", 20)
//   .attr("height", 40)
//   .attr("width", 70)
//   .attr("fill", "red");

svg
  .append("circle")
  .attr(
    "cx",
    (d, i) => i * 50 + 50
    // {
    //   console.log("Item: " + d, "Index: " + i);
    // }
  )
  .attr("cy", 250)
  .attr("r", (d) => d)
  // {
  //   console.log(d);
  // })
  .attr("fill", "red");

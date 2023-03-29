const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

let svg;
let projection;
let path;
let div;

let state = {
  data: null,
};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([d3.csv("../data/statePopulations.csv")]).then((data) => {
  state.data = data;

  console.log("state: ", state);
  init();
});

/*
 * INITIALIZING FUNCTION
 */
function init() {
  // our projection and path are only defined once, and we don't need to access them in the draw function,
  // so they can be locally scoped to init()
  const projection = d3.geoAlbersUsa().fitSize([width, height], state.data);
  const path = d3.geoPath().projection(projection);

  svg = d3
    .select("#map-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // CLEANING DATA
  cleanData = d3.groups(state.week_1, (d) => d.state);

  console.log("clean data", cleanData);

  // Map state => total noconfidence
  totalsByState = new Map(
    cleanData.map((d) => {
      const totalObject = d[1].find((r) => r.category === "Total");
      return [d[0], totalObject];
    })
  );
  console.log("totalsByState", totalsByState);

  // GETTING ONE NEEDED VALUE OUT OF OBJECT - noconf
  noconfByState = new Map(
    cleanData.map((d) => {
      const totalObject = d[1].find((r) => r.category === "Total");
      return [d[0], totalObject.noconf];
    })
  );
  console.log("noconfByState", noconfByState);

  colorScale = d3
    .scaleLinear()
    //.range(["#e7eff0", "#C8E1E5", "#B7D0D0", "#82C0CC", "#458A93", "#16697A", "#1C474D", "#0e2629"])//"#1C474D"])
    //BLUE
    // .range(["#A9D6E5"
    //     , "#89C2D9"
    //     , "#61A5C2"
    //     , "#2C7DA0"
    //     , "#2A6F97"
    //     , "#23679A", "#013A63"])
    .domain([d3.min(state.week_1, (d) => d.noconf), 1300000])
    .range(["#C8E1E5", "#0e2629"]);

  // console.log("color", colorScale.domain())
  formatTime = d3.format(",");
  svg
    .selectAll(".state")
    // all of the features of the geojson, meaning all the states as individuals
    .data(state.geojson.features)
    .join("path")
    .attr("d", path)
    .attr("class", "state")
    .style("stroke", "black")
    .attr("fill", (d) => {
      let value = noconfByState.get(d.properties.STUSPS);
      return value != 0 ? colorScale(value) : "grey";
      // console.log("value", value)
    })
    .on("mouseover", (d) => {
      div.transition().duration(50).style("opacity", 0.9);
      div
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px")
        .html(
          "<h2><strong> Week 1 </strong></h2>" +
            "<p style ='font-size:16px;' ><strong> In " +
            d.properties.NAME +
            "</strong></p>" +
            "<b>" +
            "<p style='color: #e7eff0; font-size: 20 px;'><strong> " +
            formatTime(noconfByState.get(d.properties.STUSPS)) +
            "</strong>" +
            " people had no confidence in paying rent next month" +
            "</p>"
        );
    })
    .on("mouseout", () => {
      div.transition().duration(100).style("opacity", 0);
    });
  div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  draw(); // calls the draw function
}

function draw() {}

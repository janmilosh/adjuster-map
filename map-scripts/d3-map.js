d3.helper = {};

d3.helper.tooltip = function(){
  var tooltipDiv;
  var bodyNode = d3.select('body').node();

  function tooltip(selection){

    selection.on('mouseover.tooltip', function(d){
      // Clean up lost tooltips
      d3.select('body').selectAll('div.tooltip').remove();
      // Append tooltip
      tooltipDiv = d3.select('body')
                    .append('div')
                    .attr('class', 'tooltip')
      var absoluteMousePos = d3.mouse(bodyNode);
      tooltipDiv.style({
        left: (absoluteMousePos[0] + 13)+'px',
        top: (absoluteMousePos[1] - 23)+'px',
        'background': 'rgba(255, 255, 255, 0.7)',
        color: '#333',
        padding: '5px',
        'border-radius': '2px',
        position: 'absolute',
        'z-index': 1001,
        'box-shadow': '0 1px 2px 0 rgba(0,0,0,0.4)'
      });

      var first_line = '<p>' + d.city + ', ' + d.state + '</p>'
      var second_line;
      if (d.num === '1') {
        second_line = '<p>' + d.num + ' adjuster</p>'
      } else {
        second_line = '<p>' + d.num + ' adjusters</p>'
      }
      
      tooltipDiv.html(first_line + second_line)
    })
    .on('mousemove.tooltip', function(){
      // Move tooltip
      var absoluteMousePos = d3.mouse(bodyNode);
      tooltipDiv.style({
        left: (absoluteMousePos[0] + 13)+'px',
        top: (absoluteMousePos[1] - 23)+'px'
      });
    })
    .on('mouseout.tooltip', function(){
      // Remove tooltip
      tooltipDiv.remove();
    });
  }

  tooltip.attr = function(_x){
    if (!arguments.length) return attrs;
    attrs = _x;
    return this;
  };

  tooltip.style = function(_x){
    if (!arguments.length) return styles;
    styles = _x;
    return this;
  };

  return tooltip;
};

var width = 720,
    height = 480,
    active = d3.select(null);

var projection = d3.geo.albersUsa()
  .scale(950)
  .translate([width / 2, height / 2]);
  
var zoom = d3.behavior.zoom()
  .translate([0, 0])
  .scale(1)
  .scaleExtent([1, 8])
.on("zoom", zoomed);

var path = d3.geo.path()
  .projection(projection);

var svg = d3.select("#usa-map").append("svg")
  .attr("width", width)
  .attr("height", height)
  .on("click", stopped, true);

svg.append("rect")
  .attr("class", "background")
  .attr("width", width)
  .attr("height", height)
  .on("click", reset);

var g = svg.append("g");

svg
  .call(zoom) // delete this line to disable free zooming
  .call(zoom.event);

// File path for production "ee_sys/d3-map/map-data/us.json"
// File path for development (both local and gh-pages) "map-data/us.json"
d3.json("ee_sys/d3-map/map-data/us.json", function(error, us) {

  //load and display the cities
  // File path for production "ee_sys/d3-map/map-data/cities.csv"
  // File path for development (both local and gh-pages) "map-data/cities.csv"
  d3.csv("ee_sys/d3-map/map-data/cities.csv", function(error, data) {

    var maxAdjusters = d3.max(data, function(d) { return +d.num; });

    g.selectAll(".circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("cx", function(d) {
        return projection([d.lon, d.lat])[0];
      })
      .attr("cy", function(d) {
        return projection([d.lon, d.lat])[1];
      })
      .attr("r", function(d) {
        return ((d.num * 2.5/maxAdjusters) + 1.5);
      })
      .style("fill", "#1A80C4")
      .style("stroke", "white")
      .style("stroke-width", "0.25")
      .style("cursor", "pointer")
      .call(d3.helper.tooltip());
  });

  g.selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
    .attr("d", path)
    .attr("class", "feature")
    .on("click", clicked);

  g.append("path")
    .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
    .attr("class", "mesh")
    .attr("d", path);
});

function clicked(d) {
  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);

var bounds = path.bounds(d),
  dx = bounds[1][0] - bounds[0][0],
  dy = bounds[1][1] - bounds[0][1],
  x = (bounds[0][0] + bounds[1][0]) / 2,
  y = (bounds[0][1] + bounds[1][1]) / 2,
  scale = .9 / Math.max(dx / width, dy / height),
  translate = [width / 2 - scale * x, height / 2 - scale * y];

svg.transition()
  .duration(750)
  .call(zoom.translate(translate).scale(scale).event);
}

function reset() {
  active.classed("active", false);
  active = d3.select(null);

svg.transition()
  .duration(750)
  .call(zoom.translate([0, 0]).scale(1).event);
}

function zoomed() {
  g.style("stroke-width", 1.5 / d3.event.scale + "px");
  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}
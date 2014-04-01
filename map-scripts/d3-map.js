if ($.browser.msie) {
  $('.map-text').text('This is an interactive map showing the number of Mariposa adjusters by city and state. Hover over a dot to see the city name and number of adjusters (IE9 and above). Note: For a zoomable map, please view in Safari, Chrome, or Firefox.')
}

var width = 720,
    height = 480,
    active = d3.select(null);

var projection = d3.geo.albersUsa()
  .scale(950)
  .translate([width / 2, height / 2]);
  
if (!$.browser.msie) {
  var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 8])
  .on("zoom", zoomed);
}

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

if (!$.browser.msie) {
  svg
    .call(zoom) // delete this line to disable free zooming
    .call(zoom.event);
}

d3.json("ee_sys/d3-map/map-data/us.json", function(error, us) {

  //load and display the cities
  d3.csv("ee_sys/d3-map/map-data/cities.csv", function(error, data) {
  
  if ($.browser.msie) {
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-8, 0])
      .html(function(d) {
        if (d.num === "1") {
          return d.city + ", " + d.state + "<br>" + d.num + " Adjuster";
        } else {
          return d.city + ", " + d.state + "<br>" + d.num + " Adjusters"; 
        }
    });
  } else {
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-5, 50])
      .html(function(d) {
        if (d.num === "1") {
          return d.city + ", " + d.state + "<br>" + d.num + " Adjuster";
        } else {
          return d.city + ", " + d.state + "<br>" + d.num + " Adjusters"; 
        }
    });
  }
    
  g.call(tip);

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
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);
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

if (!$.browser.msie) {
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
}

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}
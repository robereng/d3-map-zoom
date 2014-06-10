/**
 * @author rob reng
 * output the map, and handle click to zoom and update bar chart
 */

var map = (function(window, undefined) {
    var width = 600,
        height = 400;

    var continents;

    var tooltip = d3.select("#container").append("div").attr("class", "tooltip hidden");

    var active = d3.select(null);

    var clicked = d3.select(null);

    var svg = d3.select(".map").append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", reset);

    var g = svg.append("g");

    var projection = d3.geo.mercator()
        .translate([300, 200])
        .scale(80);

    var zoom = d3.behavior.zoom()
        .translate([0, 0])
        .scale(1)
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    var path = d3.geo.path()
        .projection(projection);

    function init() {

        var middleEast = ["Afghanistan", "Bahrain", "Cyprus", "Egypt", "India", "Iran", "Iraq", "Israel", "Jordan", "Kazakhstan", "Kyrgyzstan", "Kuwait", "Lebanon", "Nepal", "Northern Cyprus", "Oman", "Pakistan", "Palestine", "Qatar", "Saudi Arabia", "Syria", "Tajikistan", "Turkey", "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Yemen"];

        var asiaPac = ["American Samoa", "Australia", "Brunei", "Cambodia", "Hong Kong", "Indonesia", "Japan", "North Korea", "South Korea", "Laos", "Macau", "Malaysia", "Burma", "New Zealand", "Papua New Guinea", "Philippines", "Singapore", "Taiwan", "Thailand", "Timor-Leste", "Vietnam"];

        var europeAdditions = ["Armenia", "Azerbaijan", "Georgia"];

        d3.json("data/continent-geogame-110m.json", function(error, data) {

            var countries = topojson.feature(data, data.objects.countries);

            var europe = {
                type: "FeatureCollection",
                name: "Europe",
                color: "#eee",
                id: 3,
                features: countries.features.filter(function(d) {
                    return d.properties.continent == "Europe" || europeAdditions.indexOf(d.properties.name) != -1;
                })
            };
            var na = {
                type: "FeatureCollection",
                name: "North America",
                color: "#ccc",
                id: 4,
                features: countries.features.filter(function(d) {
                    return d.properties.continent == "North America";
                })
            };
            var sa = {
                type: "FeatureCollection",
                name: "South America",
                color: "#ccc",
                id: 5,
                features: countries.features.filter(function(d) {
                    return d.properties.continent == "South America";
                })
            };
            var uk = {
                type: "FeatureCollection",
                name: "UK",
                color: "#bbb",
                id: 8,
                features: countries.features.filter(function(d) {
                    return d.properties.name == "United Kingdom";
                })
            };
            var china = {
                type: "FeatureCollection",
                name: "China",
                color: "#aaa",
                id: 9,
                features: countries.features.filter(function(d) {
                    return d.properties.name == "China" || d.properties.name == "Mongolia";
                })
            };

            var me = {
                type: "FeatureCollection",
                name: "Middle East",
                color: "#999",
                id: 10,
                features: countries.features.filter(function(d) {
                    return middleEast.indexOf(d.properties.name) != -1 || d.properties.continent == "Africa";
                })
            };

            var ap = {
                type: "FeatureCollection",
                name: "Asia Pacific",
                color: "#ddd",
                id: 11,
                features: countries.features.filter(function(d) {
                    return asiaPac.indexOf(d.properties.name) != -1;
                })
            };

            continents = [europe, na, sa, uk, china, me, ap];

            g.selectAll(".continent").data(continents)
                .enter().append("path")
                .attr("class", "continent")
                .attr("d", path)
                .attr("id", function(d, i) {
                    return d.id;
                })
                .attr("title", function(d, i) {
                    return d.name;
                })
                .on("click", onMapClick)
                .on("mousemove", onMapMouseMove)
                .on("mouseout", onMapMouseOut);
        });
    }

    function onMapClick(d) {
        if (clicked.node() === this) {
            reset();
        } else {
            clicked.classed("clicked", false);
            clicked = d3.select(this).classed("clicked", true);

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

            bar.updatebarData(d.name);
        }
    }

    function onMapMouseMove(d) {
        var mouse = d3.mouse(svg.node()).map(function(d) {
            return parseInt(d);
        });
        tooltip
            .classed("hidden", false)
            .attr("style", "left:" + (mouse[0] + 50) + "px;top:" + (mouse[1] + 50) + "px")
            .html(d.name)

        active = d3.select(this).classed("active", true);
    }

    function onMapMouseOut() {
        tooltip.classed("hidden", true);
        active.classed("active", false);
        active = d3.select(null);
    }

    function reset() {
        clicked.classed("clicked", false);
        clicked = d3.select(null);

        svg.transition()
            .duration(750)
            .call(zoom.translate([0, 0]).scale(1).event);

        bar.updatebarData("Global");
    }

    function zoomed() {
        g.style("stroke-width", 1.5 / d3.event.scale + "px");
        g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
    return {
        init: init
    };
})(window);

map.init();

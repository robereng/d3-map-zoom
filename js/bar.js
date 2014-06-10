/**
 * @author rob reng
 * output the bar graph, default global, and offer update function for external modules to call
 */

var bar = (function(window, undefined) {
    function init() {

        d3.select(".chart")
            .append("h2")
            .text("Global");

        d3.select(".chart").append("h3")
            .html('<em class="gti_claret">6.68</em>Conversion Index Score');

        var indicators = d3.select(".chart").append("div").attr("class", "indicators");

        indicators.append("h3").text("Conversion Rates");

        var factor = indicators.selectAll("div").data(helpers.getDataBlock("Global")).enter().append("div").attr("class", "factor");

        factor.append("h5").text(function(d) {
            return d.name;
        });

        var graph = factor.append("div").attr("class", "graph");

        var outer = graph.append("div").attr("class", "bar-outer");
        graph.append("em").text(function(d) {
            return d.value;
        });
        outer.append("div").attr("class", "average-marker").style("left", function(d) {
            return d.avg + "%";
        });
        outer.append("div").attr("class", "bar").transition().style("width", function(d) {
            return d.value /
                100 * 130 + "px";
        });
    }

    function updatebarData(region) {

        d3.select(".chart")
            .select("h2")
            .text(region);

        d3.select(".chart").select("h3")
            .html('<em class="gti_claret">' + helpers.getDataConversion(region) + '</em>Conversion Index Score');

        var indicators = d3.select(".chart").select(".indicators");

        indicators.select("h3").text("Conversion Rates");

        var factor = indicators.selectAll(".factor").data(helpers.getDataBlock(region));

        factor.select("h5").text(function(d) {
            return d.name;
        });

        var graph = factor.select(".graph");

        var outer = graph.select(".bar-outer");

        graph.select("em").text(function(d) {
            return d.value;
        });

        outer.select(".average-marker").style("left", function(d) {
            return d.avg + "%";
        });
        outer.select(".bar").transition().style("width", function(d) {
            return d.value /
                100 * 130 + "px";
        });
    }
    return {
        init: init,
        updatebarData: updatebarData
    };
})(window);

bar.init();

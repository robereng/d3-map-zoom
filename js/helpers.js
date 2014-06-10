/**
 * @author rob reng
 * helper functions for the d3 map demo
 */
var helpers = (function(window, undefined) {
    function getDataBlock(region) {
        for (x in barData) {
            if (barData[x].region == region) {
                return barData[x].data;
            }
        }
    }

    function getDataConversion(region) {
        for (x in barData) {
            if (barData[x].region == region) {
                return barData[x].conv;
            }
        }
    }
    return {
        getDataBlock: getDataBlock,
        getDataConversion: getDataConversion
    }
})(window);

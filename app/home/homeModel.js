window.vjs = window.vjs || {};

(function(ns) {

    
    var TYPES_PRIMITIVE = Object.freeze(
        ['number', 'string', 'boolean', 'null', 'undefined']);

    function HomeModel() {
        this.primitiveTypes = TYPES_PRIMITIVE;
    }

    ns.HomeModel = HomeModel;

}(window.vjs));
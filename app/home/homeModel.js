window.vjs = window.vjs || {};

(function(ns) {

    ns.HomeModel = HomeModel;

    var TYPES_PRIM = Object.freeze(
        [{
            name: 'number'
        }, {
            name: 'string'
        }, {
            name: 'boolean'
        }, {
            name: 'null'
        }, {
            name: 'undefined'
        }]);

    var TYPES_REF = Object.freeze(
        [ {
            name: 'Object',
            isInstanceOf: function(value) {
                return value instanceof Object;
            }
        }, {
            name: 'Function',
            isInstanceOf: function(value) {
                return value instanceof Function;
            }
        }, {
            name: 'Array',
            isInstanceOf: function(value) {
                return value instanceof Array;
            }
        },  {
            name: 'Number',
            isInstanceOf: function(value) {
                return value instanceof Number;
            }
        },  {
            name: 'String',
            isInstanceOf: function(value) {
                return value instanceof String;
            }
        }, {
            name: 'Boolean',
            isInstanceOf: function(value) {
                return value instanceof Boolean;
            }
        }, {
            name: 'RegExp',
            isInstanceOf: function(value) {
                return value instanceof RegExp;
            }
        }]);

    var RESULT_ENUM = Object.freeze({
            true: 'green',
            false: 'rgba(255,0,0,0.1)',
            error: 'yellow'
        });

    function HomeModel() {
        this.primitiveTypes = TYPES_PRIM;
        this.referenceTypes = TYPES_REF;
        this.currType = '';
    }
    
    var isTypeSupported = function (type) {
        // check if type is supported by app
       var isSupported = false, i = 0;

       while(i < TYPES_PRIM.length && !isSupported) {
        if(type === TYPES_PRIM[i].name) {
            isSupported = true;
        }
        i += 1;
       }

        i = 0;
       while(i < TYPES_REF.length && !isSupported) {
        if(type === TYPES_REF[i].name) {
            isSupported = true;
        }
        i += 1;
       }
       return isSupported;
    };

    var checkInstanceOf = function(inp, type){
       // returns if 'inp' is instance of 'type' 
       var i = 0, result = false;
       if(isTypeSupported(type)) {
            // For primitive types instanceof will always be false 
            if(isObject(inp )) {
                result = RESULT_ENUM[inp instanceof type];    
            } else {
                result = RESULT_ENUM[false];
            }
            
       } else {
            result = RESULT_ENUM.error;
       }
       return result;
    }    

    var getTypeOf = function (inp) {
        return typeof inp;
    }

    function isObject(value) {
        return value !== null && typeof value === 'object';
    }

    HomeModel.prototype.checkInstanceOf = checkInstanceOf;
    HomeModel.prototype.getTypeOf = getTypeOf;
}(window.vjs));
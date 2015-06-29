window.vjs = window.vjs || {};

(function(ns) {

    ns.HomeModel = HomeModel;

    var JS_TYPES = Object.freeze(
        [{
            name: 'number',
            getInstance: function () {
                return 007;
            }
        }, {
            name: 'string',
            getInstance: function () {
                return "Hello World";
            }
        }, {
            name: 'boolean',
            getInstance: function () {
                return true;
            }
        }, {
            name: 'null',
            getInstance: function () {
                return null;
            }
        }, {
            name: 'undefined',
            getInstance: function () {
                return undefined;
            }
        }, {
            name: 'Object',
            isInstanceOf: function(value) {
                return value instanceof Object;
            },
            getInstance: function () {
                return new Object();
            }
        }, {
            name: 'Function',
            isInstanceOf: function(value) {
                return value instanceof Function;
            },
            getInstance: function () {
                return new Function();
            }
        }, {
            name: 'Array',
            isInstanceOf: function(value) {
                return value instanceof Array;
            },
            getInstance: function () {
                return new Array();
            }
        },  {
            name: 'Number',
            isInstanceOf: function(value) {
                return value instanceof Number;
            }, 
            getInstance: function () {
                return new Number();
            }
        },  {
            name: 'String',
            isInstanceOf: function(value) {
                return value instanceof String;
            },
            getInstance: function () {
                return new String();
            }
        }, {
            name: 'Boolean',
            isInstanceOf: function(value) {
                return value instanceof Boolean;
            }, 
            getInstance: function (){
                return new Boolean();
            }
        }, {
            name: 'RegExp',
            isInstanceOf: function(value) {
                return value instanceof RegExp;
            },
            getInstance: function() {
                return new RegExp();
            }
        }]);

    var RESULT_ENUM = Object.freeze({
            true: 'rgba(0,255,0,0.1)',
            false: 'rgba(255,0,0,0.2)',
            error: 'yellow'
        });

    function HomeModel() {
        this.allTypes = JS_TYPES;
        // this.allTypes = TYPES_PRIM + TYPES_REF;
        // this.primitiveTypes = TYPES_PRIM;
        // this.referenceTypes = TYPES_REF;
        this.currTypeId = 0;
    }

    Object.defineProperties(HomeModel.prototype, {
        currType: {
            get: function() {
            return this.allTypes[this.currTypeId];
            }
        }
    });
    
    var isTypeSupported = function (type) {
        // check if type is supported by app
       var isSupported = false, i = 0;

       while(i < JS_TYPES.length && !isSupported) {
        if(type === JS_TYPES[i].name) {
            isSupported = true;
        }
        i += 1;
       }

       //  i = 0;
       // while(i < TYPES_REF.length && !isSupported) {
       //  if(type === TYPES_REF[i].name) {
       //      isSupported = true;
       //  }
       //  i += 1;
       // }
       return isSupported;
    };

    var checkInstanceOf = function(inp, type){
       // returns if 'inp' is instance of 'type' 
       var i = 0, result = false, inpInstance = inp.getInstance();
       if(isTypeSupported(type)) {
            // For primitive types instanceof will always be false 
            if(isObject(inpInstance)) {
                result = RESULT_ENUM[inpInstance instanceof type];    
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
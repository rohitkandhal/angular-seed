window.vjs = window.vjs || {};

(function(ns) {

    ns.HomeModel = HomeModel;
    var getFunctionName = ns.utils.getFunctionName,
        isObject = ns.utils.isObject,
        isObjectInstance = ns.utils.isObjectInstance,
        isPrimitive = ns.utils.isPrimitive;

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
            },
            getTypeRef: function() {
                return Object;
            }
        }, {
            name: 'Function',
            isInstanceOf: function(value) {
                return value instanceof Function;
            },
            getInstance: function () {
                return new Function('a','return \'hello world\'');
            },
            getTypeRef: function() {
                return Function;
            }
        }, {
            name: 'Array',
            isInstanceOf: function(value) {
                return value instanceof Array;
            },
            getInstance: function () {
                return new Array();
            },
            getTypeRef: function() {
                return Array;
            }
        },  {
            name: 'Number',
            isInstanceOf: function(value) {
                return value instanceof Number;
            }, 
            getInstance: function () {
                return new Number();
            },
            getTypeRef: function () {
                return Number;
            }
        },  {
            name: 'String',
            isInstanceOf: function(value) {
                return value instanceof String;
            },
            getInstance: function () {
                return new String();
            },
            getTypeRef: function() {
                return String;
            }
        }, {
            name: 'Boolean',
            isInstanceOf: function(value) {
                return value instanceof Boolean;
            }, 
            getInstance: function (){
                return new Boolean();
            },
            getTypeRef: function() {
                return Boolean;
            }
        }, {
            name: 'RegExp',
            isInstanceOf: function(value) {
                return value instanceof RegExp;
            },
            getInstance: function() {
                return new RegExp();
            },
            getTypeRef: function() {
                return RegExp;
            }
        }]);

    var RESULT_ENUM = Object.freeze({
            true: 'rgba(0,255,0,0.3)',
            false: 'rgba(255,0,0,0.2)',
            error: 'yellow'
        });

    function HomeModel() {
        this.allTypes = JS_TYPES;
        this._currTypeId = 0;
        this._currDescriptor = new Descriptor();
    }

    Object.defineProperties(HomeModel.prototype, {
        currTypeId: {
            get: function() {
                return this._currTypeId;
            },

            set: function(val) {
                if(typeof val === 'number') {
                    this._currTypeId = val;
                    this.refreshCurrDescriptor();
                }
            }
        },

        currType: {
            get: function() {
            return this.allTypes[this.currTypeId];
            }
        },

        currDescriptor: {
            get: function() {
                return this._currDescriptor;
            }
        }
    });

    /////
    function Descriptor() {
        this.name = '';
        this.properties = '';
    }

    function buildDescriptor(obj) {
        if(!isPrimitive(obj)) {
            this.name = getFunctionName(obj);
            this.properties = Object.getOwnPropertyNames(obj);    
        } else {
            this.name = '';
            this.properties = '';
        }
        return this;        
    }

    function clear() {
        this.name = '';
        this.properties = '';
    }

    Descriptor.prototype.buildDescriptor = buildDescriptor;
    Descriptor.prototype.clear = clear;

        
    var isTypeSupported = function (type) {
        // check if type is supported by app
       var isSupported = false, i = 0;

       while(i < JS_TYPES.length && !isSupported) {
        if(type === JS_TYPES[i].name) {
            isSupported = true;
        }
        i += 1;
       }

       return isSupported;
    };

    var checkInstanceOf = function(src, target){
       // returns if 'src' is instance of 'target' type
       var result = false, inpInstance = src.getInstance();

       if(isTypeSupported(target.name)) {
            // For primitive types instanceof will always be false 
            if(!isPrimitive(inpInstance) && !isPrimitive(target.getInstance())) {
                result = target.isInstanceOf(inpInstance)
            }
       } else {
            result = 'error';
       }
       return RESULT_ENUM[result];
    }    

    function refreshCurrDescriptor() {
        if(isPrimitive(this.currType.getInstance())) {
            this._currDescriptor.clear();
        } else {
            this._currDescriptor = this.currDescriptor.buildDescriptor(this.currType.getTypeRef());    
        }  
    }

    function getTypeOf(inp) {
        return typeof inp;
    }

    HomeModel.prototype.checkInstanceOf = checkInstanceOf;
    HomeModel.prototype.getTypeOf = getTypeOf;
    HomeModel.prototype.refreshCurrDescriptor = refreshCurrDescriptor;
}(window.vjs));
window.vjs = window.vjs || {};

(function(ns) {

    ns.HomeModel = HomeModel;

    var TYPES_PRIMITIVE = Object.freeze(
        ['number', 'string', 'boolean', 'null', 'undefined']
        );

    var TYPES_REFERENCE = Object.freeze(
        ['Object', 'Function', 'Array', 'Number', 'String', 'Boolean', 'RegExp']
        );

    var COLORS = Object.freeze({
            true: 'green',
            false: 'red',
            error: 'yellow'
        });

    function HomeModel() {
        this.primitiveTypes = TYPES_PRIMITIVE;
        this.referenceTypes = TYPES_REFERENCE;
        this.currType = '';
    }
    
    var isTypeSupported = function (type) {
        // check if type is supported by app
       var isSupported = false, i = 0;

       while(i < TYPES_PRIMITIVE.length && !isSupported) {
        if(type === TYPES_PRIMITIVE[i]) {
            isSupported = true;
        }
        i += 1;
       }

        i = 0;
       while(i < TYPES_REFERENCE.length && !isSupported) {
        if(type === TYPES_REFERENCE[i]) {
            isSupported = true;
        }
        i += 1;
       }
       return isSupported;
    };

    var checkInstanceOf = function(inp, type){
       // returns if 'inp' is instance of 'type' 

       // check if type is supported by app
       var i = 0, isInstance = false;

       if(isTypeSupported(type)) {
            isInstance = inp instanceof type;
       }
       return isInstance;
    }    

    HomeModel.prototype.checkInstanceOf = checkInstanceOf;
    
}(window.vjs));
window.vjs = window.vjs || {};

(function(ns) {

    ns.HomeModel = HomeModel;
    var getFunctionName = ns.utils.getFunctionName,
        isObject = ns.utils.isObject,
        isObjectInstance = ns.utils.isObjectInstance,
        isPrimitive = ns.utils.isPrimitive;

    var JS_TYPES = Object.freeze(
        [{
            name: '007',
            getInstance: function () {
                return 007;
            }
        }, {
            name: 'Hello World',
            getInstance: function () {
                return "Hello World";
            }
        }, {
            name: 'true',
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
        buildProtoGraph(this.currDescriptor);
    }

var data1 = {
    "name": "Object",
        "parent": "null",
        "children": [{
        "name": "null",
            "parent": "Object",
            "properties": [
            "bob",
            "frank"]
    }],
        "properties": [
        "length",
        "name",
        "arguments",
        "caller",
        "prototype",
        "keys",
        "create",
        "defineProperty",
        "unobserve"]
};
    Object.defineProperties(HomeModel.prototype, {
        currTypeId: {
            get: function() {
                return this._currTypeId;
            },

            set: function(val) {
                if(typeof val === 'number') {
                    this._currTypeId = val;
                    this.refreshCurrDescriptor();


                    updateProtoTree(this.currDescriptor);
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
            this._currDescriptor = buildDescriptor(this.currType.getTypeRef());
            console.log(this.currDescriptor);
        }  
    }

    function getTypeOf(inp) {
        return typeof inp;
    }

    var tree, diagonal, svg;

    function buildProtoGraph(data) {
        if(data) {
            var margin = {
                top: 0,
                right: 20,
                bottom: 0,
                left: 200
            },
                width = 800 - margin.right - margin.left,
                height = 400 - margin.top - margin.bottom;

            tree = d3.layout.tree()
                .size([height, width]);

            diagonal = d3.svg.diagonal()
                .projection(function (d) {
                return [d.y, d.x];
            });

            svg = d3.select(".treeContainer").append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            updateProtoTree(data);
        }
    }

    function updateProtoTree(source) {
        var i = 0;

        // Compute the new tree layout.
        var nodes = tree.nodes(source),
            links = tree.links(nodes);

        //console.log(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function (d) {
            d.y = d.depth * 180;
        });

        // Declare the nodes
        var node = svg.selectAll("g.node")
            .data(nodes, function (d) {
            return d.id || (d.id = ++i);
        });

        // Enter the nodes.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

        nodeEnter.append("circle")
            .attr("r", 10)
            .style("fill", "#fff");

        var nodeText = nodeEnter.append("text")
            .attr("text-anchor", "middle")
            .attr("y", 26)
            .attr("dy", ".35em")
            .text(function (d) {
            return d.name;
        })
            .style("fill-opacity", 1);

        var someText = nodeEnter.append("text")
            .attr("class", "properties")
            .attr("text-anchor", "middle")
            .attr("y", 52)
            .style("fill-opacity", 1);

        someText.selectAll('tspan')
            .data(function (d) {
                return d.properties || [];
            })
            .enter()
            .append('tspan')
            .attr("x", 0)
            .attr('dy', function (d, i) {
                return (0.9) + "em";
            })
            .text(function (d) {
                //console.log(d);
                return d;
            });

        // Declare the links¦
        var link = svg.selectAll("path.link")
            .data(links, function (d) {
            return d.target.id;
        });

        // Enter the links.
        link.enter().insert("path", "g")
            .attr("stroke", "red")
            .attr("class", "link")
            .attr("d", diagonal);

    }
    HomeModel.prototype.checkInstanceOf = checkInstanceOf;
    HomeModel.prototype.getTypeOf = getTypeOf;
    HomeModel.prototype.refreshCurrDescriptor = refreshCurrDescriptor;

    // TODO: Move to different file//
    function Descriptor() {
        this.name = "";
        this.properties = [];
        this.parent = null;
        this.children = [];
    }

    function buildDescriptor(obj, parentName) {
        var newDesc = new Descriptor();
        //newDesc.parent = parentName || null;
        
        if(!isPrimitive(obj)) {
            newDesc.name = getFunctionName(obj);
            newDesc.properties.push(Object.getOwnPropertyNames(obj));
            newDesc.children.push(buildDescriptor(Object.getPrototypeOf(obj), newDesc.name));
        } else {
            newDesc.name = "null";
            newDesc.properties = [];
        }

        return newDesc;
    }

    function clear() {
        this._currDescriptor = new Descriptor();
    }

    Descriptor.prototype.clear = clear;
}(window.vjs));
window.vjs = window.vjs || {};

(function(ns) {

    ns.HomeModel = HomeModel;
    var Descriptor = ns.Descriptor;

    var getFunctionName = ns.utils.getFunctionName,
        isObject = ns.utils.isObject,
        isObjectInstance = ns.utils.isObjectInstance,
        isPrimitive = ns.utils.isPrimitive;

    var JS_TYPES = Object.freeze(
        [{
            name: '007',
            getInstance: function () {
                return 007;
            },
            getExample: function() {
                return "var foo = 007;";
            }
        }, {
            name: 'Hello World',
            getInstance: function () {
                return "Hello World";
            },
            getExample: function() {
                return "var foo = \"Hello World\";";
            }
        }, {
            name: 'true',
            getInstance: function () {
                return true;
            },
            getExample: function() {
                return "var foo = true;";
            }
        }, {
            name: 'null',
            getInstance: function () {
                return null;
            },
            getExample: function() {
                return "var foo = null;";
            }
        }, {
            name: 'undefined',
            getInstance: function () {
                return undefined;
            },
            getExample: function() {
                return "var foo = undefined;";
            }
        }, {
            name: 'Object',
            isInstanceOf: function(value) {
                return value instanceof Object;
            },
            getInstance: function () {
                return {};
            },
            getExample: function() {
                return "var foo = { };";
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
                return function abc() { return "hello world"; };
            },
            getExample: function() {
                return "var foo = function abc() { return \"hello world\"; };";
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
                return [];
            },
            getExample: function() {
                return "var foo = [1, 2, 3];";
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
                return new Number(30);
            },
            getExample: function() {
                return "var foo = new Number(30);";
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
                return new String("Hello World");
            },
            getExample: function() {
                return "var foo = new String(\"Hello World\");";
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
                return new Boolean(true);
            },
            getExample: function() {
                return "var foo = new Boolean(true);";
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
                return new RegExp(/[foo]+/);
            },
            getExample: function() {
                return "var foo = new RegExp(/[foo]+/);";
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
        buildProtoGraph();
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
       return result;
    }    

    function getColor(inp) {
        var result = "grey";    // default color
        if(RESULT_ENUM[inp]){
            result = RESULT_ENUM[inp]
        }
        return result;
    }

    function refreshCurrDescriptor() {
        if(isPrimitive(this.currType.getInstance())) {
            this._currDescriptor = Descriptor.buildDescriptorForPrimitive();

        } else {
            this._currDescriptor = Descriptor.buildDescriptor(this.currType.getInstance());
        }  
    }

    function getTypeOf(inp) {
        return typeof inp;
    }

    var tree, diagonal, svg;

    function buildProtoGraph() {
        // Assumes that there is a <div class="treeContainer"> present in body
            var parentWidth = d3.select(".treeContainer").node().getBoundingClientRect().width;
            parentWidth = parentWidth < 900 ? 900 : parentWidth;

            var margin = {
                top: 50,
                right: 20,
                bottom: 0,
                left: 300
            },
            width = parentWidth - margin.right - margin.left,
            height = 700 - margin.top - margin.bottom;

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
                .attr("transform", "translate(" + margin.left + "," + (-((height/2) - margin.top)) + ")");        
                // negative y transform is added to move tree all the way up. 
                // By default tree split height and starts from center. However, in our case we
                // are drawing horizontal line and don't need to use upper half portion of tree
    }

    function updateProtoTree(data) {

        // clear any existing tree if there is any for new data
        svg.selectAll("*").remove();

        //var source = JSON.parse(JSON.stringify(data));  // deep copy as d3 mutates data
        var source = Object.create(data);
        var i = 0;

        var nodes = tree.nodes(source),
            links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function (d) {
            d.y = d.depth * 250;
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

        var nodeHeader = nodeEnter.append("text")
            .attr("text-anchor", "middle")
            .attr("y", 26)
            .attr("dy", ".35em")
            .attr("class", "node-header")
            .text(function (d) {
                return d.name;
            })
            .style("fill-opacity", 1);

        var nodeProperties = nodeEnter.append("text")
            .attr("class", "properties")
            .attr("text-anchor", "start")
            .attr("y", 52)
            .style("fill-opacity", 1);

        nodeProperties.selectAll("tspan")
            .data(function (d) {
                return d.properties || [];
            })
            .enter()
            .append('tspan')
            .attr("x", -40)
            .attr('dy', function (d, i) {
                return (1.5) + "em";
            })
            .text(function (d) {
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
    HomeModel.prototype.getColor = getColor;
    HomeModel.prototype.isPrimitive = isPrimitive;
   
}(window.vjs));
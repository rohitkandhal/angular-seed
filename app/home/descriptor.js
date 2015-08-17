 window.vjs = window.vjs || {};

(function(ns) {

    ns.Descriptor = Descriptor;

    var getFunctionName = ns.utils.getFunctionName,
        isObject = ns.utils.isObject,
        isObjectInstance = ns.utils.isObjectInstance,
        isPrimitive = ns.utils.isPrimitive;

    function Descriptor() {
        this.name = "";
        this.properties = [];
        this.parent = null;
        this.children = [];
    }

    function buildDescriptor(obj, parentName) {
        var newDesc = new Descriptor();
        //newDesc.parent = parentName || null;
        
        // if(!isPrimitive(obj)) {
        if(obj !== null && (typeof obj === 'object' || obj instanceof Object)) {    // functions are instance of object but typeof is function
            newDesc.name = getFunctionName(obj);
            newDesc.properties = getPublicProperties(obj);
            newDesc.children.push(buildDescriptor(Object.getPrototypeOf(obj), newDesc.name));
        } else {
            newDesc.name = "null";
            newDesc.properties = [];
        }

        return newDesc;
    }

    function getPublicProperties(obj) {
        var props = Object.getOwnPropertyNames(obj);
        // remove private property (assuming they start and end with _ )
        return props.filter(function (str) {
            return (str.search(/^_.*_$/) < 0);
        });
    }

    function buildDescriptorForPrimitive() {
        var newDesc = new Descriptor();
        newDesc.name = "Primitive Type";
        newDesc.properties = ["No properties as it's not an object."];
        return newDesc;
    }

    Descriptor.buildDescriptor = buildDescriptor;
    Descriptor.buildDescriptorForPrimitive = buildDescriptorForPrimitive;

}(window.vjs))
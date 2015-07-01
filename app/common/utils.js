window.vjs = window.vjs || {};

(function(ns) {
	window.vjs.utils = Utils;

	function Utils() {}
	Utils.getFunctionName = getFunctionName;

	function getFunctionName(functionRef) {
		// functionRef	- reference of function whose name need to retrieved
		// Don't call, instead send reference e.g. pass  Object.toString instead of Object.toString()
		
		// Match:
		// - the beginning of the string
		// - the word 'function'
		// - at least some whitespace
		// - capture one or more valid javascript identifier characters
		// - optionally followed by whitespace
		// - followed by an opening brace
		var matchResult = /^function\s+([\w\$]+)\s*\(/.exec(functionRef.toString());
		if(matchResult && matchResult.length > 0) {
			return matchResult[1];
		}
		return 'null';
	}
}(window.vjs))
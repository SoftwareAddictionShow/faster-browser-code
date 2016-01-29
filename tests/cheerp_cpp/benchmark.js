
var jsBridge = null;

function benchmarkCheerpCPP(cb) {
	console.info('benchmarkCheerpCPP');

	if(! jsBridge) {
		jsBridge = new JsBridge();
	}

	var start_time = new Date().getTime();
	var result = jsBridge.fibonacci(43);
	var end_time = new Date().getTime();
	var diff_time = end_time - start_time;
	cb(diff_time, result);
}

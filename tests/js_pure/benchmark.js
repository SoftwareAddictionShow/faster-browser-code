



function benchmarkJSPure(cb) {
	var fibonacci = function(n) {
		if (n < 2) {
			return n;
		}
		return fibonacci(n - 2) + fibonacci(n - 1);
	};

	var start_time = new Date().getTime();
	var result = fibonacci(43);
	var end_time = new Date().getTime();
	var diff_time = end_time - start_time;
	cb(diff_time, result);
}

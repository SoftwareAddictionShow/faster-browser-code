

function fibonacci(n) {
	if (n < 2) {
		return n;
	}
	return fibonacci(n - 2) + fibonacci(n - 1);
}

function benchmarkJSWebWorker(cb) {
	var worker = new Worker('worker.js');
	worker.onmessage = function(e) {
		switch (e.data.action) {
			case 'end':
				var start_time = e.data.start_time;
				var result = e.data.result;
				var end_time = e.data.end_time;
				var diff_time = end_time - start_time;
				cb(diff_time, result);
				worker.terminate();
				break;
		}
	};

	var message = {
		action: 'start'
	};
	worker.postMessage(message);
}

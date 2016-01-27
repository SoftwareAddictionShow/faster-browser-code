


function benchmarkEmscriptenCO3(cb) {
	var currentScriptPath = function() {
		// NOTE: document.currentScript does not work in a Web Worker
		// So we have to parse a stack trace maually
		try {
			throw new Error('');
		} catch(e) {
			var stack = e.stack;
			var line = null;

			// Chrome and IE
			if (stack.indexOf('@') !== -1) {
				line = stack.split('@')[1].split('\n')[0];
			// Firefox
			} else {
				line = stack.split('(')[1].split(')')[0];
			}
			line = line.substring(0, line.lastIndexOf('/')) + '/';
			return line;
		}
	};


	console.info('benchmarkEmscriptenCO3');
	var path = currentScriptPath() + 'worker.js';
	console.info(path);
	var worker = new Worker(path);
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

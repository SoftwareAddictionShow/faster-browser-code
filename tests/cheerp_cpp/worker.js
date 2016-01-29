

var jsBridge = null;

self.addEventListener('message', function(e) {
	importScripts('cheerp_main.js');

	if(! jsBridge) {
		jsBridge = new JsBridge();
	}

	var message = {
		action: 'end',
		start_time: new Date().getTime(),
		result: jsBridge.fibonacci(43),
		end_time: new Date().getTime()
	};
	self.postMessage(message);
}, false);





self.addEventListener('message', function(e) {
	var start_time = new Date().getTime();
	importScripts('fibonacci.js');
	var end_time = new Date().getTime();

	var message = {
		action: 'end',
		start_time: start_time,
		result: null,
		end_time: end_time
	};
	self.postMessage(message);
}, false);

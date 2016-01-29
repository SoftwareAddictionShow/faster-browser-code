


self.addEventListener('message', function(e) {
	console.info(e.data);
	var fibonacci = function(n) {
		if (n < (2|0)) {
			return n;
		}
		return fibonacci(n - (2|0)) + fibonacci(n - (1|0));
	};

	var message = {
		action: 'end',
		start_time: new Date().getTime(),
		result: fibonacci((43|0)),
		end_time: new Date().getTime()
	};
	self.postMessage(message);
}, false);

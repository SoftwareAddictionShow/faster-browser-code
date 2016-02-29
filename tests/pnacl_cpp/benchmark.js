

var start_time = null;
var end_time = null;
var _cb = null;

function benchmarkPNaCl(cb) {
  _cb = cb;
  if (common.naclModule) {
    common.updateStatus('Running Test');
    start_time = new Date().getTime();
    common.naclModule.postMessage(43);
  } else {
    _cb(null);
  }
}


function handleMessage(message_event) {
	end_time = new Date().getTime();
	console.info(message_event);
	var d = message_event.data;

	diff_time = end_time - start_time;
	_cb(diff_time);
}


#include <cheerp/client.h>
#include <cheerp/clientlib.h>

using namespace client;

class [[cheerp::jsexport]] JsBridge {
private:
	int callCount;
public:
	JsBridge():callCount(0) {
	}

	int fibonacci(int n) {
		if (n < 2) {
			return n;
		}
		return fibonacci(n - 2) + fibonacci(n - 1);
	}
};

void webMain() {

}

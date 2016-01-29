

#include <stdio.h>

int fibonacci(int n) {
	if (n < 2) {
		return n;
	}
	return fibonacci(n - 2) + fibonacci(n - 1);
}

int main() {
	int retval = fibonacci(43);
	printf("fib: %d\n", retval);
	return 0;
}

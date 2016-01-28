
precision mediump float;
varying vec2 texpos;
uniform sampler2D tex0;

float in_data_length() { return IN_DATA_LENGTH; }
float in_data_width() { return IN_DATA_SIZE; }
float in_data_height() { return IN_DATA_SIZE; }
float out_data_width() { return OUT_DATA_WIDTH; }
float out_data_height() { return OUT_DATA_HEIGHT; }

int get_output_index() {
    float x = floor(texpos.x * out_data_width());
    float y = floor(texpos.y * out_data_width());
    float i = (y * in_data_height()) + x;
    return int(i);
}

int shift_right(int data, int times) {
    if (times > 0) {
        return data / int(pow(2.0, float(times)));
    } else {
        return data;
    }
}

int shift_left(int data, const int times) {
    if (times > 0) {
        return data * int(pow(2.0, float(times)));
    } else {
        return data;
    }
}

vec4 int_to_vec4(const int data) {
    int mask = shift_left(shift_right(data, 8), 8);
    float r = float(data - mask) / 255.0;

    mask = shift_left(shift_right(data, 16), 16);
    float g = float(shift_right(data - mask, 8)) / 255.0;

    mask = shift_left(shift_right(data, 24), 24);
    float b = float(shift_right(data - mask, 16)) / 255.0;

    float a = float(shift_right(data, 24)) / 255.0;
    return vec4(r, g, b, a);
}

const int N = 43;

int fibonacci() {
    if (N <= 1) {
        return N;
    }
    int result = 1;
    int prev = 1;
    for (int i=2; i<N; ++i) {
        int temp = result;
        result += prev;
        prev = temp;
    }
    return result;
}

void main() {
    if (get_output_index() == 0) {
        int result = fibonacci();
        gl_FragColor = int_to_vec4(result);
        //gl_FragColor = vec4(float(0x19) / 255.0, float(0xD6) / 255.0, float(0x99) / 255.0, float(0xA5) / 255.0);
    } else {
        //gl_FragColor = vec4(0, 0, 0, 0);
    }
}

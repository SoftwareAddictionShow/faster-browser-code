
attribute vec2 vtxpos;
varying vec2 texpos;
void main() {
    texpos = (vtxpos / 2.) + vec2(0.5, 0.5);
    gl_Position = vec4(vtxpos, 0, 1);
}

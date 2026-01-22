uniform float u_time;
uniform float u_progress;
uniform sampler2D u_image;
varying float vWave;

varying vec2 vUv;

void main() {

    vec3 color = texture2D(u_image, vUv).rgb;

    gl_FragColor = vec4(color, 1.0);
}

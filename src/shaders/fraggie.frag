uniform float u_time;
uniform float u_mouseCoord_x;
uniform float u_mouseCoord_y;
uniform float u_duration;

uniform sampler2D u_texture;

varying vec2 vUv;
varying vec3 v_position;

void main() {

    vec2 p = vUv * 2.0 - 1.0;     // center UVs
    float len = length(p);       // distance from center

    vec2 rippleOffset = vUv + p / len * 0.03 * cos(len * 12.0 - u_time * 4.0);

    float delta = (sin(mod(u_time, u_duration) * (2.0 * 3.14159265 / u_duration)) + 1.0) * 0.5;

    vec2 uv = mix(rippleOffset, vUv, 0.5);
    vec3 color = texture2D(u_texture, uv).rgb;

    gl_FragColor = vec4(color, 1.0);
}
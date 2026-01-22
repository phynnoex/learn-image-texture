uniform float u_time;
uniform float u_progress;

uniform sampler2D u_texture1;
uniform sampler2D u_texture2;

varying vec2 vUv;
varying vec3 v_position;

void main() {


    vec3 color1 = texture2D(u_texture1,vUv).rgb;
    vec3 color2 = texture2D(u_texture2,vUv).rgb;

    float anim = u_progress;

    float dir = smoothstep(u_progress, u_progress + clamp(u_progress, 0., 0.35), vUv.x);

    vec3 color = mix(color1, color2, dir);
    gl_FragColor = vec4(color, 1.0);
}

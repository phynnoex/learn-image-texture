uniform float u_time;
uniform float u_mouseCoord_x;
uniform float u_mouseCoord_y;
varying vec3 v_position;
varying vec2 vUv;

void main() {

  vUv = uv;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.y += sin(modelPosition.x * 4.0) * 0.2;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}

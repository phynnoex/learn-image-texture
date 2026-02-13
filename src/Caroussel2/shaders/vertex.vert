uniform float u_time;
varying vec3 v_position;
uniform float u_scrollSpeed;
varying vec2 vUv;

// Classic Perlin 3D Noise 
// by Stefan Gustavson
//

// End of Perlin Noise Code

void main() {

    vec3 position = position;
    // vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;

    vUv = uv;
    // vDisplacement = cnoise(position + u_time + u_seed );
    vec3 newPosition = position;

    //curve

    // float xDisplacement = -3.0 * cos(worldPosition.x * 0.3);
    // newPosition.z +=  xDisplacement;
    // newPosition.z  += 2.0;
    // newPosition.y  += 1.0;

    float displacement = -sin(uv.y * 3.1415) * u_scrollSpeed * 0.1 ; // *2, *5, etc.
    newPosition.x += displacement;
    
    


    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

    vec4 projectedPosition = projectionMatrix * viewMatrix * modelPosition;

    gl_Position = projectedPosition;
}

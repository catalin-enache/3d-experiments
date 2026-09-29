#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 a_position;
uniform mat3 u_matrix;

// all shaders have a main function
void main() {

  vec3 transformedPosition = u_matrix * vec3(a_position, 1.0);

  gl_Position = vec4(transformedPosition.xy, 0.0, 1.0);
}
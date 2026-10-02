#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 a_position;
uniform vec2 u_resolution;
uniform mat3 u_matrix;
out vec4 v_color;

// all shaders have a main function
void main() {
  vec2 position = (u_matrix * vec3(a_position, 1.0)).xy;

  // position / u_resolution converts from pixels to 0.0 to 1.0
  // * 2 - 1.0 converts from 0->1 to -1->+1 (clipspace) | y is at the bottom
  // * vec2(1, -1) flips the y axis so that 0 is at the top
  vec2 clipSpace = ((position / u_resolution) * 2.0 - 1.0) * vec2(1, -1);

  gl_Position = vec4(clipSpace, 0.0, 1.0);
  v_color = gl_Position * 0.5 + 0.5;
}
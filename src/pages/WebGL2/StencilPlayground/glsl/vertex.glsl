#version 300 es

// 2D shapes: the unit quad (-1..1) and the unit circle
in vec2 a_position;

// xy: scale, zw: offset, places the shape in a space where
// y goes from -1 to 1 and x from -aspect to aspect
uniform vec4 u_transform;
// width / height of the viewport, so circles stay round
uniform float u_aspect;
// the shapes are flat, all at the same depth except for the depth blocker,
// which is closer to the camera (smaller z) so it hides what is behind it
uniform float u_depth;

void main() {
  vec2 position = a_position * u_transform.xy + u_transform.zw;
  gl_Position = vec4(position.x / u_aspect, position.y, u_depth, 1.0);
}

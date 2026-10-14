#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec3 a_normal;

// DIFFERENT from the directional light: the light has a position
// instead of a direction, in world space
uniform vec3 u_lightWorldPosition;

// DIFFERENT: the world matrix is needed too, to know where each vertex
// is in the world (the directional light didn't care where the surface was)
uniform mat4 u_world;
uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;

// varying to pass the normal to the fragment shader
out vec3 v_normal;

// DIFFERENT: varying to pass the direction from the surface to the light.
// With a directional light it was the same for every point (a uniform),
// with a point light every point of the surface sees the light
// from a different direction
out vec3 v_surfaceToLight;

void main() {
  gl_Position = u_worldViewProjection * a_position;

  // orient the normals and pass to the fragment shader
  v_normal = mat3(u_worldInverseTranspose) * a_normal;

  // DIFFERENT: where this vertex is in the world
  vec3 surfaceWorldPosition = (u_world * a_position).xyz;

  // DIFFERENT: the vector from the surface to the light.
  // It plays the same role as u_reverseLightDirection (it points toward
  // the light) but it is computed per vertex.
  // It is NOT normalized here: interpolating unnormalized vectors between
  // vertices gives the right direction at every pixel, normalizing first
  // would give wrong in-between directions
  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
}

#version 300 es

// same vertex shader as the point light: a spot light is a point light
// whose light only goes out inside a cone. The cone is handled
// per pixel in the fragment shader

in vec4 a_position;
in vec3 a_normal;

// where the light is, in world space
uniform vec3 u_lightWorldPosition;
// where the camera (the eye) is in world space, for the specular highlight
uniform vec3 u_viewWorldPosition;

uniform mat4 u_world;
uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;

out vec3 v_normal;
// the vector from the surface to the light. The fragment shader uses it
// for the diffuse light, the attenuation AND to know if the point is
// inside the cone
out vec3 v_surfaceToLight;
out vec3 v_surfaceToView;

void main() {
  gl_Position = u_worldViewProjection * a_position;

  // orient the normals and pass to the fragment shader
  v_normal = mat3(u_worldInverseTranspose) * a_normal;

  // where this vertex is in the world
  vec3 surfaceWorldPosition = (u_world * a_position).xyz;

  // not normalized: interpolating unnormalized vectors between vertices
  // gives the right direction at every pixel
  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
  v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
}

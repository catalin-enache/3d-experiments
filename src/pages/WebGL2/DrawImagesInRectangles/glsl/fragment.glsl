#version 300 es
precision highp float;

in vec2 v_texcoord;

uniform sampler2D u_texture;

out vec4 outColor;

void main() {
  if (v_texcoord.x < 0.0 ||
      v_texcoord.y < 0.0 ||
      v_texcoord.x > 1.0 ||
      v_texcoord.y > 1.0) {
    outColor = vec4(0, 0, 1, 1); // blue
    return;
    // discard;
  }

  outColor = texture(u_texture, v_texcoord);
}

#version 300 es
precision highp float;

in vec4 v_color;

// tint applied to the vertex color: color * mult + offset
uniform vec4 u_colorMult;
uniform vec4 u_colorOffset;

out vec4 outColor;

void main() {
  outColor = v_color * u_colorMult + u_colorOffset;
}

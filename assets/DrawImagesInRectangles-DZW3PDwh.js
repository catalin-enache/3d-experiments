import{g as e,o as t}from"./index-CcwAWkbw.js";import{n,r,t as i}from"./webgl-BFJtxVZL.js";import{b as a,l as o,p as s,s as c,u as l}from"./m4-BcdbHlg4.js";var u=`#version 300 es

in vec4 a_position;
in vec2 a_texcoord;

uniform mat4 u_matrix;
uniform mat4 u_textureMatrix;

out vec2 v_texcoord;

void main() {
  gl_Position = u_matrix * a_position;
  v_texcoord = (u_textureMatrix * vec4(a_texcoord, 0, 1)).xy;
}`,d=`#version 300 es
precision highp float;

in vec2 v_texcoord;

uniform sampler2D u_texture;

out vec4 outColor;

void main() {
  if (v_texcoord.x < 0.0 ||
      v_texcoord.y < 0.0 ||
      v_texcoord.x > 1.0 ||
      v_texcoord.y > 1.0) {
    outColor = vec4(0, 0, 1, 1); 
    return;
    
  }

  outColor = texture(u_texture, v_texcoord);
}`,f=[`textures/star.jpg`,`textures/leaves.jpg`,`textures/keyboard.jpg`],p=9,m=60;function h(e,t){let n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array([0,0,255,255])),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);let r={width:1,height:1,texture:n},i=new Image;return i.onload=()=>{r.width=i.width,r.height=i.height,e.bindTexture(e.TEXTURE_2D,r.texture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,i),e.generateMipmap(e.TEXTURE_2D)},i.src=t,r}async function g({container:e,webglContextAttributes:t}){let{gl:g,cleanUp:_}=n({container:e,webglContextAttributes:t}),v=await i({gl:g,vertexShaderSource:u,fragmentShaderSource:d}),y=g.getAttribLocation(v,`a_position`),b=g.getAttribLocation(v,`a_texcoord`),x=g.getUniformLocation(v,`u_matrix`),S=g.getUniformLocation(v,`u_texture`),C=g.getUniformLocation(v,`u_textureMatrix`),w=g.createVertexArray();g.bindVertexArray(w);let T=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,T),g.bufferData(g.ARRAY_BUFFER,new Float32Array([0,0,0,1,1,0,1,0,0,1,1,1]),g.STATIC_DRAW),g.enableVertexAttribArray(y),g.vertexAttribPointer(y,2,g.FLOAT,!1,0,0);let E=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,E),g.bufferData(g.ARRAY_BUFFER,new Float32Array([0,0,0,1,1,0,1,0,0,1,1,1]),g.STATIC_DRAW),g.enableVertexAttribArray(b),g.vertexAttribPointer(b,2,g.FLOAT,!1,0,0);let D=f.map(e=>h(g,e)),O=[];for(let e=0;e<p;++e){let e=Math.random()*.25+.25,t={x:Math.random()*g.canvas.width,y:Math.random()*g.canvas.height,dx:Math.random()>.5?-1:1,dy:Math.random()>.5?-1:1,xScale:e,yScale:e,offX:0,offY:0,rotation:Math.random()*Math.PI*2,deltaRotation:(.5+Math.random()*.5)*(Math.random()>.5?-1:1),width:1,height:1,textureInfo:D[Math.random()*D.length|0]};O.push(t)}function k(e,t,n,r,i,u=t,d=n,f,p,m,h,_=0){f===void 0&&(f=r,r=0),p===void 0&&(p=i,i=0),m===void 0&&(m=u,u=t),h===void 0&&(h=d,d=n),g.useProgram(v),g.bindVertexArray(w),g.uniform1i(S,0),g.activeTexture(g.TEXTURE0+0),g.bindTexture(g.TEXTURE_2D,e);let y=c(0,g.canvas.width,g.canvas.height,0,-1,1);y=s(y,f,p,0),y=o(y,m,h,1),g.uniformMatrix4fv(x,!1,y);let b=l(1/t,1/n,1);b=s(b,t*.5,n*.5,0),b=a(b,_),b=s(b,t*-.5,n*-.5,0),b=s(b,r,i,0),b=o(b,u,d,1),g.uniformMatrix4fv(C,!1,b),g.drawArrays(g.TRIANGLES,0,6)}function A(e){for(let t of O){t.x+=t.dx*m*e,t.y+=t.dy*m*e;let n=t.textureInfo.width*t.xScale,r=t.textureInfo.height*t.yScale;t.x<0&&(t.dx=1),t.x+n>=g.canvas.width&&(t.dx=-1),t.y<0&&(t.dy=1),t.y+r>=g.canvas.height&&(t.dy=-1),t.rotation+=t.deltaRotation*e}}function j(){g.viewport(0,0,g.canvas.width,g.canvas.height),g.clearColor(0,0,0,0),g.clear(g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT);for(let{textureInfo:e,...t}of O)k(e.texture,e.width,e.height,e.width*t.offX,e.height*t.offY,e.width*t.width,e.height*t.height,t.x,t.y,e.width*t.xScale,e.height*t.yScale,t.rotation)}return r({tick:({timer:e})=>{A(Math.min(.1,e.getDelta())),j()},cleanUp:_})}var _=e();function v(){return(0,_.jsx)(t,{nativeScenario:g,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{v as default};
import{g as e,ht as t,o as n}from"./index-6FzA5AJq.js";import{n as r,r as i,t as a}from"./webgl-vSbijmij.js";var o=`#version 300 es

in vec4 a_position;
in vec2 a_texcoord;

uniform mat4 u_matrix;
uniform mat4 u_textureMatrix;

out vec2 v_texcoord;

void main() {
  gl_Position = u_matrix * a_position;
  v_texcoord = (u_textureMatrix * vec4(a_texcoord, 0, 1)).xy;
}`,s=`#version 300 es
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
}`,c=[`textures/star.jpg`,`textures/leaves.jpg`,`textures/keyboard.jpg`],l=9,u=60;function d(e,t){let n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array([0,0,255,255])),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);let r={width:1,height:1,texture:n},i=new Image;return i.onload=()=>{r.width=i.width,r.height=i.height,e.bindTexture(e.TEXTURE_2D,r.texture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,i),e.generateMipmap(e.TEXTURE_2D)},i.src=t,r}async function f({container:e,webglContextAttributes:n}){let{gl:f,cleanUp:p}=r({container:e,webglContextAttributes:n}),m=await a({gl:f,vertexShaderSource:o,fragmentShaderSource:s}),h=f.getAttribLocation(m,`a_position`),g=f.getAttribLocation(m,`a_texcoord`),_=f.getUniformLocation(m,`u_matrix`),v=f.getUniformLocation(m,`u_texture`),y=f.getUniformLocation(m,`u_textureMatrix`),b=f.createVertexArray();f.bindVertexArray(b);let x=f.createBuffer();f.bindBuffer(f.ARRAY_BUFFER,x),f.bufferData(f.ARRAY_BUFFER,new Float32Array([0,0,0,1,1,0,1,0,0,1,1,1]),f.STATIC_DRAW),f.enableVertexAttribArray(h),f.vertexAttribPointer(h,2,f.FLOAT,!1,0,0);let S=f.createBuffer();f.bindBuffer(f.ARRAY_BUFFER,S),f.bufferData(f.ARRAY_BUFFER,new Float32Array([0,0,0,1,1,0,1,0,0,1,1,1]),f.STATIC_DRAW),f.enableVertexAttribArray(g),f.vertexAttribPointer(g,2,f.FLOAT,!1,0,0);let C=c.map(e=>d(f,e)),w=[];for(let e=0;e<l;++e){let e=Math.random()*.25+.25,t={x:Math.random()*f.canvas.width,y:Math.random()*f.canvas.height,dx:Math.random()>.5?-1:1,dy:Math.random()>.5?-1:1,xScale:e,yScale:e,offX:0,offY:0,rotation:Math.random()*Math.PI*2,deltaRotation:(.5+Math.random()*.5)*(Math.random()>.5?-1:1),width:1,height:1,textureInfo:C[Math.random()*C.length|0]};w.push(t)}function T(e,n,r,i,a,o=n,s=r,c,l,u,d,p=0){c===void 0&&(c=i,i=0),l===void 0&&(l=a,a=0),u===void 0&&(u=o,o=n),d===void 0&&(d=s,s=r),f.useProgram(m),f.bindVertexArray(b),f.uniform1i(v,0),f.activeTexture(f.TEXTURE0+0),f.bindTexture(f.TEXTURE_2D,e);let h=new t().makeOrthographic(0,f.canvas.width,0,f.canvas.height,-1,1).multiply(new t().makeTranslation(c,l,0)).multiply(new t().makeScale(u,d,1));f.uniformMatrix4fv(_,!1,h.elements);let g=new t().makeScale(1/n,1/r,1).multiply(new t().makeTranslation(n*.5,r*.5,0)).multiply(new t().makeRotationZ(p)).multiply(new t().makeTranslation(n*-.5,r*-.5,0)).multiply(new t().makeTranslation(i,a,0)).multiply(new t().makeScale(o,s,1));f.uniformMatrix4fv(y,!1,g.elements),f.drawArrays(f.TRIANGLES,0,6)}function E(e){for(let t of w)t.x+=t.dx*u*e,t.y+=t.dy*u*e,t.x<0&&(t.dx=1),t.x>=f.canvas.width&&(t.dx=-1),t.y<0&&(t.dy=1),t.y>=f.canvas.height&&(t.dy=-1),t.rotation+=t.deltaRotation*e}function D(){f.viewport(0,0,f.canvas.width,f.canvas.height),f.clearColor(0,0,0,0),f.clear(f.COLOR_BUFFER_BIT|f.DEPTH_BUFFER_BIT);for(let{textureInfo:e,...t}of w)T(e.texture,e.width,e.height,e.width*t.offX,e.height*t.offY,e.width*t.width,e.height*t.height,t.x,t.y,e.width*t.xScale,e.height*t.yScale,t.rotation)}return i({tick:({timer:e})=>{E(Math.min(.1,e.getDelta())),D()},cleanUp:p})}var p=e();function m(){return(0,p.jsx)(n,{nativeScenario:f,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{m as default};
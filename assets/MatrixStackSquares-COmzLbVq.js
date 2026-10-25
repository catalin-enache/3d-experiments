import{g as e,o as t}from"./index-CcwAWkbw.js";import{n,r,t as i}from"./webgl-BFJtxVZL.js";import{b as a,g as o,l as s,n as c,p as l,s as u,t as d,v as f}from"./m4-BcdbHlg4.js";var p=class{stack=[];constructor(){this.restore()}restore(){this.stack.pop(),this.stack.length<1&&(this.stack[0]=c())}save(){this.stack.push(this.getCurrentMatrix())}getCurrentMatrix(){return d(this.stack[this.stack.length-1])}setCurrentMatrix(e){this.stack[this.stack.length-1]=e}translate(e,t,n=0){let r=this.getCurrentMatrix();this.setCurrentMatrix(l(r,e,t,n))}rotateX(e){let t=this.getCurrentMatrix();this.setCurrentMatrix(o(t,e))}rotateY(e){let t=this.getCurrentMatrix();this.setCurrentMatrix(f(t,e))}rotateZ(e){let t=this.getCurrentMatrix();this.setCurrentMatrix(a(t,e))}scale(e,t,n=1){let r=this.getCurrentMatrix();this.setCurrentMatrix(s(r,e,t,n))}},m=`#version 300 es

in vec4 a_position;

uniform mat4 u_matrix;

void main() {
  gl_Position = u_matrix * a_position;
}`,h=`#version 300 es
precision highp float;

uniform vec4 u_color;

out vec4 outColor;

void main() {
  outColor = u_color;
}`,g=[{x:.25,y:.3,size:120,xScale:1,yScale:1,rotationSpeed:.5,color:[.9,.3,.3,1],children:[{x:1,y:0,size:.35,xScale:1,yScale:1,rotationSpeed:2,color:[1,.8,.3,1],children:[]}]},{x:.7,y:.3,size:90,xScale:2,yScale:.6,rotationSpeed:-.8,color:[.3,.8,.4,1],children:[{x:.6,y:.8,size:.3,xScale:1,yScale:1,rotationSpeed:-3,color:[.2,.5,1,1],children:[]},{x:-.6,y:-.8,size:.3,xScale:1,yScale:1,rotationSpeed:3,color:[.8,.4,1,1],children:[]}]},{x:.5,y:.72,size:150,xScale:.7,yScale:1.3,rotationSpeed:.3,color:[.3,.6,.9,1],children:[{x:0,y:.8,size:.4,xScale:1,yScale:1,rotationSpeed:-1.5,color:[.9,.5,.2,1],children:[{x:1,y:0,size:.4,xScale:1,yScale:1,rotationSpeed:4,color:[1,1,1,1],children:[]}]}]}];async function _({container:e,webglContextAttributes:t}){let{gl:a,cleanUp:o}=n({container:e,webglContextAttributes:t}),s=await i({gl:a,vertexShaderSource:m,fragmentShaderSource:h}),c=a.getAttribLocation(s,`a_position`),l=a.getUniformLocation(s,`u_matrix`),d=a.getUniformLocation(s,`u_color`),f=a.createVertexArray();a.bindVertexArray(f);let _=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,_),a.bufferData(a.ARRAY_BUFFER,new Float32Array([-.5,-.5,.5,-.5,-.5,.5,-.5,.5,.5,-.5,.5,.5]),a.STATIC_DRAW),a.enableVertexAttribArray(c),a.vertexAttribPointer(c,2,a.FLOAT,!1,0,0);let v=new p;function y(e,t){v.save(),v.rotateZ(t*e.rotationSpeed);for(let n of e.children)v.save(),v.translate(n.x*e.size,n.y*e.size),y({...n,size:n.size*e.size},t),v.restore();v.scale(e.size*e.xScale,e.size*e.yScale),a.uniformMatrix4fv(l,!1,v.getCurrentMatrix()),a.uniform4fv(d,e.color),a.drawArrays(a.TRIANGLES,0,6),v.restore()}a.useProgram(s),a.bindVertexArray(f);function b({timer:e}){let t=e.getElapsed();a.viewport(0,0,a.canvas.width,a.canvas.height),a.clearColor(0,0,0,0),a.clear(a.COLOR_BUFFER_BIT|a.DEPTH_BUFFER_BIT),v.setCurrentMatrix(u(0,a.canvas.width,a.canvas.height,0,-1,1));for(let e of g)v.save(),v.translate(e.x*a.canvas.width,e.y*a.canvas.height),y(e,t),v.restore()}return r({tick:b,cleanUp:o})}var v=e();function y(){return(0,v.jsx)(t,{nativeScenario:_,options:{webglContextAttributes:{preserveDrawingBuffer:!1}}})}export{y as default};
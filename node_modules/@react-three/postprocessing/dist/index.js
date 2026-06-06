import{jsx as w,jsxs as K,Fragment as Q}from"react/jsx-runtime";import ee,{createContext as te,useState as j,useMemo as z,useRef as O,useContext as M,useEffect as A,memo as he,forwardRef as B,useLayoutEffect as L,useImperativeHandle as oe,useCallback as ae}from"react";import*as h from"three";import{NoToneMapping as _e,HalfFloatType as xe,Vector3 as ge,Uniform as y,TextureLoader as we,SRGBColorSpace as Se,RepeatWrapping as Y,Texture as ye,Color as Pe,CanvasTexture as be,NearestFilter as re}from"three";import{useThree as V,useFrame as J,extend as Ee,createPortal as Re,useLoader as Ue,applyProps as Ce}from"@react-three/fiber";import{EffectComposer as ze,RenderPass as Te,NormalPass as Ae,DepthDownsamplingPass as Be,Effect as W,EffectPass as Ve,Pass as Fe,DepthOfFieldEffect as Me,MaskFunction as De,DepthPickingPass as ke,CopyPass as Ge,BloomEffect as Ie,BrightnessContrastEffect as Le,ChromaticAberrationEffect as Ne,ColorAverageEffect as je,ColorDepthEffect as Oe,DepthEffect as We,DotScreenEffect as Xe,GlitchEffect as qe,GlitchMode as ne,GodRaysEffect as He,GridEffect as Ze,HueSaturationEffect as $e,NoiseEffect as Ke,OutlineEffect as Ye,PixelationEffect as Je,ScanlineEffect as Qe,SelectiveBloomEffect as et,SepiaEffect as tt,SSAOEffect as ot,SMAAEffect as at,FXAAEffect as rt,TextureEffect as nt,ToneMappingEffect as st,VignetteEffect as it,ShockWaveEffect as lt,LUT3DEffect as ct,TiltShiftEffect as ft}from"postprocessing";import{easing as se}from"maath";import{N8AOPostPass as ut}from"n8ao";const H=/*@__PURE__*/te(null);function pt({children:e,enabled:t=!0}){const[o,r]=j([]),a=z(()=>({selected:o,select:r,enabled:t}),[o,r,t]);return /*@__PURE__*/w(H.Provider,{value:a,children:e})}function mt({enabled:e=!1,children:t,...o}){const r=O(null),a=M(H);return A(()=>{if(a&&e){let n=!1;const i=[];if(r.current.traverse(s=>{s.type==="Mesh"&&i.push(s),a.selected.indexOf(s)===-1&&(n=!0)}),n)return a.select(s=>[...s,...i]),()=>{a.select(s=>s.filter(l=>!i.includes(l)))}}},[e,t,a]),/*@__PURE__*/w("group",{ref:r,...o,children:t})}const D=/*@__PURE__*/te(null),ie=e=>(e.getAttributes()&2)===2,dt=/*@__PURE__*/he(/*@__PURE__*/B(({children:e,camera:t,scene:o,resolutionScale:r,enabled:a=!0,renderPriority:n=1,autoClear:i=!0,depthBuffer:s,enableNormalPass:l,stencilBuffer:p,multisampling:_=8,frameBufferType:S=xe},g)=>{const{gl:d,scene:m,camera:v,size:x}=V(),f=o||m,u=t||v,[c,U,b]=z(()=>{const C=new ze(d,{depthBuffer:s,stencilBuffer:p,multisampling:_,frameBufferType:S});C.addPass(new Te(f,u));let R=null,E=null;return l&&(E=new Ae(f,u),E.enabled=!1,C.addPass(E),r!==void 0&&(R=new Be({normalBuffer:E.texture,resolutionScale:r}),R.enabled=!1,C.addPass(R))),[C,E,R]},[u,d,s,p,_,S,f,l,r]);A(()=>c?.setSize(x.width,x.height),[c,x]),J((C,R)=>{if(a){const E=d.autoClear;d.autoClear=i,p&&!i&&d.clearStencil(),c.render(R),d.autoClear=E}},a?n:0);const F=O(null);L(()=>{const C=[],R=F.current.__r3f;if(R&&c){const E=R.children;for(let T=0;T<E.length;T++){const N=E[T].object;if(N instanceof W){const q=[N];if(!ie(N)){let G=null;for(;(G=E[T+1]?.object)instanceof W&&!ie(G);)q.push(G),T++}const $=new Ve(u,...q);C.push($)}else N instanceof Fe&&C.push(N)}for(const T of C)c?.addPass(T);U&&(U.enabled=!0),b&&(b.enabled=!0)}return()=>{for(const E of C)c?.removePass(E);U&&(U.enabled=!1),b&&(b.enabled=!1)}},[c,e,u,U,b]),A(()=>{const C=d.toneMapping;return d.toneMapping=_e,()=>{d.toneMapping=C}},[d]);const X=z(()=>({composer:c,normalPass:U,downSamplingPass:b,resolutionScale:r,camera:u,scene:f}),[c,U,b,r,u,f]);return oe(g,()=>c,[c]),/*@__PURE__*/w(D.Provider,{value:X,children:/*@__PURE__*/w("group",{ref:F,children:e})})})),k=e=>typeof e=="object"&&e!=null&&"current"in e?e.current:e;let vt=0;const le=/*@__PURE__*/new WeakMap,P=(e,t)=>function({blendFunction:o=t?.blendFunction,opacity:r=t?.opacity,...a}){let n=le.get(e);if(!n){const l=`@react-three/postprocessing/${e.name}-${vt++}`;Ee({[l]:e}),le.set(e,n=l)}const i=V(l=>l.camera),s=ee.useMemo(()=>[...t?.args??[],...a.args??[{...t,...a}]],[JSON.stringify(a)]);return /*@__PURE__*/w(n,{camera:i,"blendMode-blendFunction":o,"blendMode-opacity-value":r,...a,args:s})},Z=(e,t)=>{const o=e[t];return ee.useMemo(()=>typeof o=="number"?new h.Vector2(o,o):o?new h.Vector2(...o):new h.Vector2,[o])},ce=/*@__PURE__*/B(function({blendFunction:e,worldFocusDistance:t,worldFocusRange:o,focusDistance:r,focusRange:a,focalLength:n,bokehScale:i,resolutionScale:s,resolutionX:l,resolutionY:p,width:_,height:S,target:g,depthTexture:d,...m},v){const{camera:x}=M(D),f=g!=null,u=z(()=>{const c=new Me(x,{blendFunction:e,worldFocusDistance:t,worldFocusRange:o,focusDistance:r,focusRange:a,focalLength:n,bokehScale:i,resolutionScale:s,resolutionX:l,resolutionY:p,width:_,height:S});f&&(c.target=new ge),d&&c.setDepthTexture(d.texture,d.packing);const U=c.maskPass;return U.maskFunction=De.MULTIPLY_RGB_SET_ALPHA,c},[x,e,t,o,r,a,n,i,s,l,p,_,S,f,d]);return A(()=>()=>{u.dispose()},[u]),/*@__PURE__*/w("primitive",{...m,ref:v,object:u,target:g})}),ht=/*@__PURE__*/B(({target:e=void 0,mouse:t=!1,debug:o=void 0,manual:r=!1,smoothTime:a=.25,...n},i)=>{const s=O(null),l=O(null),p=O(null),_=V(({scene:b})=>b),S=V(({pointer:b})=>b),{composer:g,camera:d}=M(D),[m]=j(()=>new ke),[v]=j(()=>new Ge);A(()=>(g.addPass(m),g.addPass(v),()=>{g.removePass(m),g.removePass(v)}),[g,m,v]),A(()=>()=>{m.dispose(),v.dispose()},[m,v]);const[x]=j(()=>new h.Vector3(0,0,0)),[f]=j(()=>new h.Vector3(0,0,0)),u=ae(async(b,F)=>(f.x=b,f.y=F,f.z=await m.readDepth(f),f.z=f.z*2-1,1-f.z>1e-7?f.unproject(d):!1),[f,m,d]),c=ae(async(b,F=!0)=>{if(e)x.set(...e);else{const{x:X,y:C}=t?S:{x:0,y:0},R=await u(X,C);R&&x.copy(R)}F&&s.current?.target&&(a>0&&b>0?se.damp3(s.current.target,x,a,b):s.current.target.copy(x))},[e,x,t,u,a,S]);J(async(b,F)=>{r||c(F),l.current&&l.current.position.copy(x),p.current&&s.current?.target&&p.current.position.copy(s.current.target)});const U=z(()=>({dofRef:s,hitpoint:x,update:c}),[x,c]);return oe(i,()=>U,[U]),/*@__PURE__*/K(Q,{children:[o?Re(/*@__PURE__*/K(Q,{children:[/*@__PURE__*/K("mesh",{ref:l,children:[/*@__PURE__*/w("sphereGeometry",{args:[o,16,16]}),/*@__PURE__*/w("meshBasicMaterial",{color:"#00ff00",opacity:1,transparent:!0,depthWrite:!1})]}),/*@__PURE__*/K("mesh",{ref:p,children:[/*@__PURE__*/w("sphereGeometry",{args:[o/2,16,16]}),/*@__PURE__*/w("meshBasicMaterial",{color:"#00ff00",opacity:.5,transparent:!0,depthWrite:!1})]})]}),_):null,/*@__PURE__*/w(ce,{ref:s,...n,target:x})]})}),_t={fragmentShader:`
    uniform float time;
    uniform vec2 lensPosition;
    uniform vec2 screenRes;
    uniform vec3 colorGain;
    uniform float starPoints;
    uniform float glareSize;
    uniform float flareSize;
    uniform float flareSpeed;
    uniform float flareShape;
    uniform float haloScale;
    uniform float opacity;
    uniform bool animated;
    uniform bool anamorphic;
    uniform bool enabled;
    uniform bool secondaryGhosts;
    uniform bool starBurst;
    uniform float ghostScale;
    uniform bool aditionalStreaks;
    uniform sampler2D lensDirtTexture;
    vec2 vTexCoord;
    
    float rand(float n){return fract(sin(n) * 43758.5453123);}

    float noise(float p){
      float fl = floor(p);
      float fc = fract(p);
      return mix(rand(fl),rand(fl + 1.0), fc);
    }

    vec3 hsv2rgb(vec3 c)
    {
      vec4 k = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + k.xyz) * 6.0 - k.www);
      return c.z * mix(k.xxx, clamp(p - k.xxx, 0.0, 1.0), c.y);
    }

    float saturate(float x)
    {
      return clamp(x, 0.,1.);
    }

    vec2 rotateUV(vec2 uv, float rotation)
    {
      return vec2(
          cos(rotation) * uv.x + sin(rotation) * uv.y,
          cos(rotation) * uv.y - sin(rotation) * uv.x
      );
    }

    // Based on https://www.shadertoy.com/view/XtKfRV
    vec3 drawflare(vec2 p, float intensity, float rnd, float speed, int id)
    {
      float flarehueoffset = (1. / 32.) * float(id) * 0.1;
      float lingrad = distance(vec2(0.), p);
      float expgrad = 1. / exp(lingrad * (fract(rnd) * 0.66 + 0.33));
      vec3 colgrad = hsv2rgb(vec3( fract( (expgrad * 8.) + speed * flareSpeed + flarehueoffset), pow(1.-abs(expgrad*2.-1.), 0.45), 20.0 * expgrad * intensity)); //rainbow spectrum effect

      float internalStarPoints;

      if(anamorphic){
        internalStarPoints = 1.0;
      } else{
        internalStarPoints = starPoints;
      }
      
      float blades = length(p * flareShape * sin(internalStarPoints * atan(p.x, p.y)));
      
      float comp = pow(1.-saturate(blades), ( anamorphic ? 100. : 12.));
      comp += saturate(expgrad-0.9) * 3.;
      comp = pow(comp * expgrad, 8. + (1.-intensity) * 5.);
      
      if(flareSpeed > 0.0){
        return vec3(comp) * colgrad;
      } else{
        return vec3(comp) * flareSize * 15.;
      }
    }

    float dist(vec3 a, vec3 b) { return abs(a.x - b.x) + abs(a.y - b.y) + abs(a.z - b.z); }

    vec3 saturate(vec3 x)
    {
      return clamp(x, vec3(0.0), vec3(1.0));
    }

    // Based on https://www.shadertoy.com/view/XtKfRV
    float glare(vec2 uv, vec2 pos, float size)
    {
      vec2 main;

      if(animated){
        main = rotateUV(uv-pos, time * 0.1);      
      } else{
        main = uv-pos;     
      }
      
      float ang = atan(main.y, main.x) * (anamorphic ? 1.0 : starPoints);
      float dist = length(main); 
      dist = pow(dist, .9);
      
      float f0 = 1.0/(length(uv-pos)*(1.0/size*16.0)+.2);

      return f0+f0*(sin((ang))*.2 +.3);
    }

    float sdHex(vec2 p){
      p = abs(p);
      vec2 q = vec2(p.x*2.0*0.5773503, p.y + p.x*0.5773503);
      return dot(step(q.xy,q.yx), 1.0-q.yx);
    }

    //Based on https://www.shadertoy.com/view/dllSRX
    float fpow(float x, float k){
      return x > k ? pow((x-k)/(1.0-k),2.0) : 0.0;
    }

    vec3 renderhex(vec2 uv, vec2 p, float s, vec3 col){
      uv -= p;
      if (abs(uv.x) < 0.2*s && abs(uv.y) < 0.2*s){
          return mix(vec3(0),mix(vec3(0),col,0.1 + fpow(length(uv/s),0.1)*10.0),smoothstep(0.0,0.1,sdHex(uv*20.0/s)));
      }
      return vec3(0);
    }

    // Based on https://www.shadertoy.com/view/4sX3Rs
    vec3 LensFlare(vec2 uv, vec2 pos)
    {
      vec2 main = uv-pos;
      vec2 uvd = uv*(length(uv));
      
      float ang = atan(main.x,main.y);
      
      float f0 = .3/(length(uv-pos)*16.0+1.0);
      
      f0 = f0*(sin(noise(sin(ang*3.9-(animated ? time : 0.0) * 0.3) * starPoints))*.2 );
      
      float f1 = max(0.01-pow(length(uv+1.2*pos),1.9),.0)*7.0;

      float f2 = max(.9/(10.0+32.0*pow(length(uvd+0.99*pos),2.0)),.0)*0.35;
      float f22 = max(.9/(11.0+32.0*pow(length(uvd+0.85*pos),2.0)),.0)*0.23;
      float f23 = max(.9/(12.0+32.0*pow(length(uvd+0.95*pos),2.0)),.0)*0.6;
      
      vec2 uvx = mix(uv,uvd, 0.1);
      
      float f4 = max(0.01-pow(length(uvx+0.4*pos),2.9),.0)*4.02;
      float f42 = max(0.0-pow(length(uvx+0.45*pos),2.9),.0)*4.1;
      float f43 = max(0.01-pow(length(uvx+0.5*pos),2.9),.0)*4.6;
      
      uvx = mix(uv,uvd,-.4);
      
      float f5 = max(0.01-pow(length(uvx+0.1*pos),5.5),.0)*2.0;
      float f52 = max(0.01-pow(length(uvx+0.2*pos),5.5),.0)*2.0;
      float f53 = max(0.01-pow(length(uvx+0.1*pos),5.5),.0)*2.0;
      
      uvx = mix(uv,uvd, 2.1);
      
      float f6 = max(0.01-pow(length(uvx-0.3*pos),1.61),.0)*3.159;
      float f62 = max(0.01-pow(length(uvx-0.325*pos),1.614),.0)*3.14;
      float f63 = max(0.01-pow(length(uvx-0.389*pos),1.623),.0)*3.12;
      
      vec3 c = vec3(glare(uv,pos, glareSize));

      vec2 prot;

      if(animated){
        prot = rotateUV(uv - pos, (time * 0.1));  
      } else if(anamorphic){
        prot = rotateUV(uv - pos, 1.570796);     
      } else {
        prot = uv - pos;
      }

      c += drawflare(prot, (anamorphic ? flareSize * 10. : flareSize), 0.1, time, 1);
      
      c.r+=f1+f2+f4+f5+f6; c.g+=f1+f22+f42+f52+f62; c.b+=f1+f23+f43+f53+f63;
      c = c*1.3 * vec3(length(uvd)+.09);
      c+=vec3(f0);
      
      return c;
    }

    vec3 cc(vec3 color, float factor,float factor2)
    {
      float w = color.x+color.y+color.z;
      return mix(color,vec3(w)*factor,w*factor2);
    }    

    float rnd(vec2 p)
    {
      float f = fract(sin(dot(p, vec2(12.1234, 72.8392) )*45123.2));
      return f;   
    }

    float rnd(float w)
    {
      float f = fract(sin(w)*1000.);
      return f;   
    }

    float regShape(vec2 p, int N)
    {
      float f;
      
      float a=atan(p.x,p.y)+.2;
      float b=6.28319/float(N);
      f=smoothstep(.5,.51, cos(floor(.5+a/b)*b-a)*length(p.xy)* 2.0  -ghostScale);
          
      return f;
    }

    // Based on https://www.shadertoy.com/view/Xlc3D2
    vec3 circle(vec2 p, float size, float decay, vec3 color, vec3 color2, float dist, vec2 position)
    {
      float l = length(p + position*(dist*2.))+size/2.;
      float l2 = length(p + position*(dist*4.))+size/3.;
      
      float c = max(0.01-pow(length(p + position*dist), size*ghostScale), 0.0)*10.;
      float c1 = max(0.001-pow(l-0.3, 1./40.)+sin(l*20.), 0.0)*3.;
      float c2 =  max(0.09/pow(length(p-position*dist/.5)*1., .95), 0.0)/20.;
      float s = max(0.02-pow(regShape(p*5. + position*dist*5. + decay, 6) , 1.), 0.0)*1.5;
      
      color = cos(vec3(0.44, .24, .2)*16. + dist/8.)*0.5+.5;
      vec3 f = c*color;
      f += c1*color;
      f += c2*color;  
      f +=  s*color;
      return f;
    }

    vec4 getLensColor(float x){
      return vec4(vec3(mix(mix(mix(mix(mix(mix(mix(mix(mix(mix(mix(mix(mix(mix(mix(vec3(0., 0., 0.),
        vec3(0., 0., 0.), smoothstep(0.0, 0.063, x)),
        vec3(0., 0., 0.), smoothstep(0.063, 0.125, x)),
        vec3(0.0, 0., 0.), smoothstep(0.125, 0.188, x)),
        vec3(0.188, 0.131, 0.116), smoothstep(0.188, 0.227, x)),
        vec3(0.31, 0.204, 0.537), smoothstep(0.227, 0.251, x)),
        vec3(0.192, 0.106, 0.286), smoothstep(0.251, 0.314, x)),
        vec3(0.102, 0.008, 0.341), smoothstep(0.314, 0.392, x)),
        vec3(0.086, 0.0, 0.141), smoothstep(0.392, 0.502, x)),
        vec3(1.0, 0.31, 0.0), smoothstep(0.502, 0.604, x)),
        vec3(.1, 0.1, 0.1), smoothstep(0.604, 0.643, x)),
        vec3(1.0, 0.929, 0.0), smoothstep(0.643, 0.761, x)),
        vec3(1.0, 0.086, 0.424), smoothstep(0.761, 0.847, x)),
        vec3(1.0, 0.49, 0.0), smoothstep(0.847, 0.89, x)),
        vec3(0.945, 0.275, 0.475), smoothstep(0.89, 0.941, x)),
        vec3(0.251, 0.275, 0.796), smoothstep(0.941, 1.0, x))),
      1.0);
    }

    float dirtNoise(vec2 p){
      vec2 f = fract(p);
      f = (f * f) * (3.0 - (2.0 * f));    
      float n = dot(floor(p), vec2(1.0, 157.0));
      vec4 a = fract(sin(vec4(n + 0.0, n + 1.0, n + 157.0, n + 158.0)) * 43758.5453123);
      return mix(mix(a.x, a.y, f.x), mix(a.z, a.w, f.x), f.y);
    } 

    float fbm(vec2 p){
      const mat2 m = mat2(0.80, -0.60, 0.60, 0.80);
      float f = 0.0;
      f += 0.5000*dirtNoise(p); p = m*p*2.02;
      f += 0.2500*dirtNoise(p); p = m*p*2.03;
      f += 0.1250*dirtNoise(p); p = m*p*2.01;
      f += 0.0625*dirtNoise(p);
      return f/0.9375;
    }

    vec4 getLensStar(vec2 p){
      vec2 pp = (p - vec2(0.5)) * 2.0;
      float a = atan(pp.y, pp.x);
      vec4 cp = vec4(sin(a * 1.0), length(pp), sin(a * 13.0), sin(a * 53.0));
      float d = sin(clamp(pow(length(vec2(0.5) - p) * 0.5 + haloScale /2., 5.0), 0.0, 1.0) * 3.14159);
      vec3 c = vec3(d) * vec3(fbm(cp.xy * 16.0) * fbm(cp.zw * 9.0) * max(max(max(max(0.5, sin(a * 1.0)), sin(a * 3.0) * 0.8), sin(a * 7.0) * 0.8), sin(a * 9.0) * 10.6));
      c *= vec3(mix(2.0, (sin(length(pp.xy) * 256.0) * 0.5) + 0.5, sin((clamp((length(pp.xy) - 0.875) / 0.1, 0.0, 1.0) + 0.0) * 2.0 * 3.14159) * 1.5) + 0.5) * 0.3275;
      return vec4(vec3(c * 1.0), d);	
    }

    vec4 getLensDirt(vec2 p){
      p.xy += vec2(fbm(p.yx * 3.0), fbm(p.yx * 2.0)) * 0.0825;
      vec3 o = vec3(mix(0.125, 0.25, max(max(smoothstep(0.1, 0.0, length(p - vec2(0.25))),
                                            smoothstep(0.4, 0.0, length(p - vec2(0.75)))),
                                            smoothstep(0.8, 0.0, length(p - vec2(0.875, 0.125))))));
      o += vec3(max(fbm(p * 1.0) - 0.5, 0.0)) * 0.5;
      o += vec3(max(fbm(p * 2.0) - 0.5, 0.0)) * 0.5;
      o += vec3(max(fbm(p * 4.0) - 0.5, 0.0)) * 0.25;
      o += vec3(max(fbm(p * 8.0) - 0.75, 0.0)) * 1.0;
      o += vec3(max(fbm(p * 16.0) - 0.75, 0.0)) * 0.75;
      o += vec3(max(fbm(p * 64.0) - 0.75, 0.0)) * 0.5;
      return vec4(clamp(o, vec3(0.15), vec3(1.0)), 1.0);	
    }

    vec4 textureLimited(sampler2D tex, vec2 texCoord){
      if(((texCoord.x < 0.) || (texCoord.y < 0.)) || ((texCoord.x > 1.) || (texCoord.y > 1.))){
        return vec4(0.0);
      }else{
        return texture(tex, texCoord); 
      }
    }

    vec4 textureDistorted(sampler2D tex, vec2 texCoord, vec2 direction, vec3 distortion) {
      return vec4(textureLimited(tex, (texCoord + (direction * distortion.r))).r,
                  textureLimited(tex, (texCoord + (direction * distortion.g))).g,
                  textureLimited(tex, (texCoord + (direction * distortion.b))).b,
                  1.0);
    }

    // Based on https://www.shadertoy.com/view/4sK3W3
    vec4 getStartBurst(){
      vec2 aspectTexCoord = vec2(1.0) - (((vTexCoord - vec2(0.5)) * vec2(1.0)) + vec2(0.5)); 
      vec2 texCoord = vec2(1.0) - vTexCoord; 
      vec2 ghostVec = (vec2(0.5) - texCoord) * 0.3 - lensPosition;
      vec2 ghostVecAspectNormalized = normalize(ghostVec * vec2(1.0)) * vec2(1.0);
      vec2 haloVec = normalize(ghostVec) * 0.6;
      vec2 haloVecAspectNormalized = ghostVecAspectNormalized * 0.6;
      vec2 texelSize = vec2(1.0) / vec2(screenRes.xy);
      vec3 distortion = vec3(-(texelSize.x * 1.5), 0.2, texelSize.x * 1.5);
      vec4 c = vec4(0.0);
      for (int i = 0; i < 8; i++) {
        vec2 offset = texCoord + (ghostVec * float(i));
        c += textureDistorted(lensDirtTexture, offset, ghostVecAspectNormalized, distortion) * pow(max(0.0, 1.0 - (length(vec2(0.5) - offset) / length(vec2(0.5)))), 10.0);
      }                       
      vec2 haloOffset = texCoord + haloVecAspectNormalized; 
      return (c * getLensColor((length(vec2(0.5) - aspectTexCoord) / length(vec2(haloScale))))) + 
            (textureDistorted(lensDirtTexture, haloOffset, ghostVecAspectNormalized, distortion) * pow(max(0.0, 1.0 - (length(vec2(0.5) - haloOffset) / length(vec2(0.5)))), 10.0));
    } 

    void mainImage(vec4 inputColor, vec2 uv, out vec4 outputColor)
    {
      vec2 myUV = uv -0.5;
      myUV.y *= screenRes.y/screenRes.x;
      vec2 finalLensPosition = lensPosition * 0.5;
      finalLensPosition.y *= screenRes.y/screenRes.x;
      
      //First Lens flare pass
      vec3 finalColor = LensFlare(myUV, finalLensPosition) * 20.0 * colorGain / 256.;

      //Aditional streaks
      if(aditionalStreaks){
        vec3 circColor = vec3(0.9, 0.2, 0.1);
        vec3 circColor2 = vec3(0.3, 0.1, 0.9);

        for(float i=0.;i<10.;i++){
          finalColor += circle(myUV, pow(rnd(i*2000.)*2.8, .1)+1.41, 0.0, circColor+i , circColor2+i, rnd(i*20.)*3.+0.2-.5, lensPosition);
        }
      }

      //Alternative ghosts
      if(secondaryGhosts){
        vec3 altGhosts = vec3(0);
        altGhosts += renderhex(myUV, -lensPosition*0.25, ghostScale * 1.4, vec3(0.25,0.35,0));
        altGhosts += renderhex(myUV, lensPosition*0.25, ghostScale * 0.5, vec3(1,0.5,0.5));
        altGhosts += renderhex(myUV, lensPosition*0.1, ghostScale * 1.6, vec3(1,1,1));
        altGhosts += renderhex(myUV, lensPosition*1.8, ghostScale * 2.0, vec3(0,0.5,0.75));
        altGhosts += renderhex(myUV, lensPosition*1.25, ghostScale * 0.8, vec3(1,1,0.5));
        altGhosts += renderhex(myUV, -lensPosition*1.25, ghostScale * 5.0, vec3(0.5,0.5,0.25));
        
        //Circular ghosts
        altGhosts += fpow(1.0 - abs(distance(lensPosition*0.8,myUV) - 0.7),0.985)*colorGain / 2100.;
        finalColor += altGhosts;
      }
      

      //Starburst                     
      if(starBurst){
        vTexCoord = myUV + 0.5;
        vec4 lensMod = getLensDirt(myUV);
        float tooBright = 1.0 - (clamp(0.5, 0.0, 0.5) * 2.0); 
        float tooDark = clamp(0.5 - 0.5, 0.0, 0.5) * 2.0;
        lensMod += mix(lensMod, pow(lensMod * 2.0, vec4(2.0)) * 0.5, tooBright);
        float lensStarRotationAngle = ((myUV.x + myUV.y)) * (1.0 / 6.0);
        vec2 lensStarTexCoord = (mat2(cos(lensStarRotationAngle), -sin(lensStarRotationAngle), sin(lensStarRotationAngle), cos(lensStarRotationAngle)) * vTexCoord);
        lensMod += getLensStar(lensStarTexCoord) * 2.;
        
        finalColor += clamp((lensMod.rgb * getStartBurst().rgb ), 0.01, 1.0);
      }

      //Final composed output
      if(enabled){
        outputColor = vec4(mix(finalColor, vec3(.0), opacity) + inputColor.rgb, inputColor.a);
      } else {
        outputColor = vec4(inputColor);
      }
    }
  `};class fe extends W{constructor({blendFunction:t,enabled:o,glareSize:r,lensPosition:a,screenRes:n,starPoints:i,flareSize:s,flareSpeed:l,flareShape:p,animated:_,anamorphic:S,colorGain:g,lensDirtTexture:d,haloScale:m,secondaryGhosts:v,aditionalStreaks:x,ghostScale:f,opacity:u,starBurst:c}){super("LensFlareEffect",_t.fragmentShader,{blendFunction:t,uniforms:/*@__PURE__*/new Map([["enabled",new h.Uniform(o)],["glareSize",new h.Uniform(r)],["lensPosition",new h.Uniform(a)],["time",new h.Uniform(0)],["screenRes",new h.Uniform(n)],["starPoints",new h.Uniform(i)],["flareSize",new h.Uniform(s)],["flareSpeed",new h.Uniform(l)],["flareShape",new h.Uniform(p)],["animated",new h.Uniform(_)],["anamorphic",new h.Uniform(S)],["colorGain",new h.Uniform(g)],["lensDirtTexture",new h.Uniform(d)],["haloScale",new h.Uniform(m)],["secondaryGhosts",new h.Uniform(v)],["aditionalStreaks",new h.Uniform(x)],["ghostScale",new h.Uniform(f)],["starBurst",new h.Uniform(c)],["opacity",new h.Uniform(u)]])})}update(t,o,r){const a=this.uniforms.get("time");a&&(a.value+=r)}}const xt=/*@__PURE__*/P(fe),gt=({smoothTime:e=.07,blendFunction:t=23,enabled:o=!0,glareSize:r=.2,lensPosition:a=new h.Vector3(-25,6,-60),screenRes:n=new h.Vector2(0,0),starPoints:i=6,flareSize:s=.01,flareSpeed:l=.01,flareShape:p=.01,animated:_=!0,anamorphic:S=!1,colorGain:g=new h.Color(20,20,20),lensDirtTexture:d=null,haloScale:m=.5,secondaryGhosts:v=!0,aditionalStreaks:x=!0,ghostScale:f=0,opacity:u=1,starBurst:c=!1})=>{const U=V(({viewport:T})=>T),b=V(({raycaster:T})=>T),{scene:F,camera:X}=M(D),[C]=j(()=>new h.Vector2),[R]=j(()=>new h.Vector3),E=O(null);return J((T,N)=>{if(!E?.current)return;const q=E.current.uniforms.get("lensPosition"),$=E.current.uniforms.get("opacity");if(!q||!$)return;let G=1;if(R.copy(a).project(X),R.z>1)return;q.value.x=R.x,q.value.y=R.y,C.x=R.x,C.y=R.y,b.setFromCamera(C,X);const ve=b.intersectObjects(F.children,!0),{object:I}=ve[0]||{};I&&(I.userData?.lensflare==="no-occlusion"?G=0:I instanceof h.Mesh&&(I.material.uniforms?._transmission?.value>.2||I.material._transmission&&I.material._transmission>.2?G=.2:I.material.transparent&&(G=I.material.opacity))),se.damp($,"value",G,e,N)}),A(()=>{if(!E?.current)return;const T=E.current.uniforms.get("screenRes");T&&(T.value.x=U.width,T.value.y=U.height)},[U]),/*@__PURE__*/w(xt,{ref:E,blendFunction:t,enabled:o,glareSize:r,lensPosition:a,screenRes:n,starPoints:i,flareSize:s,flareSpeed:l,flareShape:p,animated:_,anamorphic:S,colorGain:g,lensDirtTexture:d,haloScale:m,secondaryGhosts:v,aditionalStreaks:x,ghostScale:f,opacity:u,starBurst:c})},wt=/*@__PURE__*/P(Ie,{blendFunction:0}),St=/*@__PURE__*/P(Le),yt=/*@__PURE__*/P(Ne),Pt=/*@__PURE__*/B(function({blendFunction:e=23},t){const o=z(()=>new je(e),[e]);return /*@__PURE__*/w("primitive",{ref:t,object:o,dispose:null})}),bt=/*@__PURE__*/P(Oe),Et=/*@__PURE__*/P(We),Rt=/*@__PURE__*/P(Xe),Ut=/*@__PURE__*/B(function({active:e=!0,...t},o){const r=V(p=>p.invalidate),a=Z(t,"delay"),n=Z(t,"duration"),i=Z(t,"strength"),s=Z(t,"chromaticAberrationOffset"),l=z(()=>new qe({...t,delay:a,duration:n,strength:i,chromaticAberrationOffset:s}),[a,n,t,i,s]);return L(()=>{l.mode=e?t.mode||ne.SPORADIC:ne.DISABLED,r()},[e,l,r,t.mode]),A(()=>()=>{l.dispose?.()},[l]),/*@__PURE__*/w("primitive",{ref:o,object:l,dispose:null})}),Ct=/*@__PURE__*/B(function(e,t){const{camera:o}=M(D),r=z(()=>new He(o,k(e.sun),e),[o,e]);return L(()=>void(r.lightSource=k(e.sun)),[r,e.sun]),/*@__PURE__*/w("primitive",{ref:t,object:r,dispose:null})}),zt=/*@__PURE__*/B(function({size:e,...t},o){const r=V(n=>n.invalidate),a=z(()=>new Ze(t),[t]);return L(()=>{e&&a.setSize(e.width,e.height),r()},[a,e,r]),/*@__PURE__*/w("primitive",{ref:o,object:a,dispose:null})}),Tt=/*@__PURE__*/P($e),At=/*@__PURE__*/P(Ke,{blendFunction:5}),Bt=/*@__PURE__*/B(function({selection:e=[],selectionLayer:t=10,blendFunction:o,patternTexture:r,edgeStrength:a,pulseSpeed:n,visibleEdgeColor:i,hiddenEdgeColor:s,width:l,height:p,kernelSize:_,blur:S,xRay:g,...d},m){const v=V(U=>U.invalidate),{scene:x,camera:f}=M(D),u=z(()=>new Ye(x,f,{blendFunction:o,patternTexture:r,edgeStrength:a,pulseSpeed:n,visibleEdgeColor:i,hiddenEdgeColor:s,width:l,height:p,kernelSize:_,blur:S,xRay:g,...d}),[o,S,f,a,p,s,_,r,n,x,i,l,g]),c=M(H);return A(()=>{if(!c&&e)return u.selection.set(Array.isArray(e)?e.map(k):[k(e)]),v(),()=>{u.selection.clear(),v()}},[u,e,c,v]),A(()=>{u.selectionLayer=t,v()},[u,v,t]),O(void 0),A(()=>{if(c&&c.enabled&&c.selected?.length)return u.selection.set(c.selected),v(),()=>{u.selection.clear(),v()}},[c,u.selection,v]),A(()=>()=>{u.dispose()},[u]),/*@__PURE__*/w("primitive",{ref:m,object:u})}),Vt=/*@__PURE__*/B(function({granularity:e=5},t){const o=z(()=>new Je(e),[e]);return /*@__PURE__*/w("primitive",{ref:t,object:o,dispose:null})}),Ft=/*@__PURE__*/P(Qe,{blendFunction:24,density:1.25}),Mt=(e,t)=>e.layers.enable(t.selection.layer),Dt=(e,t)=>e.layers.disable(t.selection.layer),kt=/*@__PURE__*/B(function({selection:e=[],selectionLayer:t=10,lights:o=[],inverted:r=!1,ignoreBackground:a=!1,luminanceThreshold:n,luminanceSmoothing:i,intensity:s,width:l,height:p,kernelSize:_,mipmapBlur:S,...g},d){o.length===0&&console.warn("SelectiveBloom requires lights to work.");const m=V(c=>c.invalidate),{scene:v,camera:x}=M(D),f=z(()=>{const c=new et(v,x,{blendFunction:0,luminanceThreshold:n,luminanceSmoothing:i,intensity:s,width:l,height:p,kernelSize:_,mipmapBlur:S,...g});return c.inverted=r,c.ignoreBackground=a,c},[v,x,n,i,s,l,p,_,S,r,a,g]),u=M(H);return A(()=>{if(!u&&e)return f.selection.set(Array.isArray(e)?e.map(k):[k(e)]),m(),()=>{f.selection.clear(),m()}},[f,e,u,m]),A(()=>{f.selection.layer=t,m()},[f,m,t]),A(()=>{if(o&&o.length>0)return o.forEach(c=>Mt(k(c),f)),m(),()=>{o.forEach(c=>Dt(k(c),f)),m()}},[f,m,o,t]),A(()=>{if(u&&u.enabled&&u.selected?.length)return f.selection.set(u.selected),m(),()=>{f.selection.clear(),m()}},[u,f.selection,m]),/*@__PURE__*/w("primitive",{ref:d,object:f,dispose:null})}),Gt=/*@__PURE__*/P(tt),It=/*@__PURE__*/B(function(e,t){const{camera:o,normalPass:r,downSamplingPass:a,resolutionScale:n}=M(D),i=z(()=>r===null&&a===null?(console.error("Please enable the NormalPass in the EffectComposer in order to use SSAO."),{}):new ot(o,r&&!a?r.texture:null,{blendFunction:21,samples:30,rings:4,distanceThreshold:1,distanceFalloff:0,rangeThreshold:.5,rangeFalloff:.1,luminanceInfluence:.9,radius:20,bias:.5,intensity:1,color:void 0,normalDepthBuffer:a?a.texture:null,resolutionScale:n??1,depthAwareUpsampling:!0,...e}),[o,a,r,n]);return /*@__PURE__*/w("primitive",{ref:t,object:i,dispose:null})}),Lt=/*@__PURE__*/P(at),Nt=/*@__PURE__*/P(rt),jt={fragmentShader:`
    uniform int rampType;

    uniform vec2 rampStart;
    uniform vec2 rampEnd;

    uniform vec4 startColor;
    uniform vec4 endColor;

    uniform float rampBias;
    uniform float rampGain;

    uniform bool rampMask;
    uniform bool rampInvert;

    float getBias(float time, float bias) {
      return time / (((1.0 / bias) - 2.0) * (1.0 - time) + 1.0);
    }

    float getGain(float time, float gain) {
      if (time < 0.5)
        return getBias(time * 2.0, gain) / 2.0;
      else
        return getBias(time * 2.0 - 1.0, 1.0 - gain) / 2.0 + 0.5;
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
      vec2 centerPixel = uv * resolution;
      vec2 startPixel = rampStart * resolution;
      vec2 endPixel = rampEnd * resolution;

      float rampAlpha;

      if (rampType == 1) {
        vec2 fuv = centerPixel / resolution.y;
        vec2 suv = startPixel / resolution.y;
        vec2 euv = endPixel / resolution.y;

        float radius = length(suv - euv);
        float falloff = length(fuv - suv);
        rampAlpha = smoothstep(0.0, radius, falloff);
      } else {
        float radius = length(startPixel - endPixel);
        vec2 direction = normalize(vec2(endPixel.x - startPixel.x, -(startPixel.y - endPixel.y)));

        float fade = dot(centerPixel - startPixel, direction);
        if (rampType == 2) fade = abs(fade);

        rampAlpha = smoothstep(0.0, 1.0, fade / radius);
      }

      rampAlpha = abs((rampInvert ? 1.0 : 0.0) - getBias(rampAlpha, rampBias) * getGain(rampAlpha, rampGain));

      if (rampMask) {
        vec4 inputBuff = texture2D(inputBuffer, uv);
        outputColor = mix(inputBuff, inputColor, rampAlpha);
      } else {
        outputColor = mix(startColor, endColor, rampAlpha);
      }
    }
  `};var ue=/*@__PURE__*/(e=>(e[e.Linear=0]="Linear",e[e.Radial=1]="Radial",e[e.MirroredLinear=2]="MirroredLinear",e))(ue||{});class pe extends W{constructor({rampType:t=0,rampStart:o=[.5,.5],rampEnd:r=[1,1],startColor:a=[0,0,0,1],endColor:n=[1,1,1,1],rampBias:i=.5,rampGain:s=.5,rampMask:l=!1,rampInvert:p=!1,..._}={}){super("RampEffect",jt.fragmentShader,{..._,uniforms:/*@__PURE__*/new Map([["rampType",new y(t)],["rampStart",new y(o)],["rampEnd",new y(r)],["startColor",new y(a)],["endColor",new y(n)],["rampBias",new y(i)],["rampGain",new y(s)],["rampMask",new y(l)],["rampInvert",new y(p)]])})}}const Ot=/*@__PURE__*/P(pe),Wt=/*@__PURE__*/B(function({textureSrc:e,texture:t,opacity:o=1,...r},a){const n=Ue(we,e);L(()=>{n.colorSpace=Se,n.wrapS=n.wrapT=Y},[n]);const i=z(()=>new nt({...r,texture:n||t}),[r,n,t]);return /*@__PURE__*/w("primitive",{ref:a,object:i,"blendMode-opacity-value":o,dispose:null})}),Xt=/*@__PURE__*/P(st),qt=/*@__PURE__*/P(it),Ht=/*@__PURE__*/P(lt),Zt=/*@__PURE__*/B(function({lut:e,tetrahedralInterpolation:t,...o},r){const a=z(()=>new ct(e,o),[e,o]),n=V(i=>i.invalidate);return L(()=>{t&&(a.tetrahedralInterpolation=t),e&&(a.lut=e),n()},[a,n,e,t]),/*@__PURE__*/w("primitive",{ref:r,object:a,dispose:null})}),$t=/*@__PURE__*/P(ft,{blendFunction:0}),Kt={fragmentShader:`

    // original shader by Evan Wallace

    #define MAX_ITERATIONS 100

    uniform float blur;
    uniform float taper;
    uniform vec2 start;
    uniform vec2 end;
    uniform vec2 direction;
    uniform int samples;

    float random(vec3 scale, float seed) {
        /* use the fragment position for a different seed per-pixel */
        return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec4 color = vec4(0.0);
        float total = 0.0;
        vec2 startPixel = vec2(start.x * resolution.x, start.y * resolution.y);
        vec2 endPixel = vec2(end.x * resolution.x, end.y * resolution.y);
        float f_samples = float(samples);
        float half_samples = f_samples / 2.0;

        // use screen diagonal to normalize blur radii
        float maxScreenDistance = distance(vec2(0.0), resolution); // diagonal distance
        float gradientRadius = taper * (maxScreenDistance);
        float blurRadius = blur * (maxScreenDistance / 16.0);

        /* randomize the lookup values to hide the fixed number of samples */
        float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);
        vec2 normal = normalize(vec2(startPixel.y - endPixel.y, endPixel.x - startPixel.x));
        float radius = smoothstep(0.0, 1.0, abs(dot(uv * resolution - startPixel, normal)) / gradientRadius) * blurRadius;

        #pragma unroll_loop_start
        for (int i = 0; i <= MAX_ITERATIONS; i++) {
            if (i >= samples) { break; } // return early if over sample count
            float f_i = float(i);
            float s_i = -half_samples + f_i;
            float percent = (s_i + offset - 0.5) / half_samples;
            float weight = 1.0 - abs(percent);
            vec4 sample_i = texture2D(inputBuffer, uv + normalize(direction) / resolution * percent * radius);
            /* switch to pre-multiplied alpha to correctly blur transparent images */
            sample_i.rgb *= sample_i.a;
            color += sample_i * weight;
            total += weight;
        }
        #pragma unroll_loop_end

        outputColor = color / total;

        /* switch back from pre-multiplied alpha */
        outputColor.rgb /= outputColor.a + 0.00001;
    }
    `};class me extends W{constructor({blendFunction:t=23,blur:o=.15,taper:r=.5,start:a=[.5,0],end:n=[.5,1],samples:i=10,direction:s=[1,1]}={}){super("TiltShiftEffect",Kt.fragmentShader,{blendFunction:t,attributes:2,uniforms:/*@__PURE__*/new Map([["blur",new y(o)],["taper",new y(r)],["start",new y(a)],["end",new y(n)],["samples",new y(i)],["direction",new y(s)]])})}}const Yt=/*@__PURE__*/P(me,{blendFunction:23}),Jt=`
uniform sampler2D uCharacters;
uniform float uCharactersCount;
uniform float uCellSize;
uniform bool uInvert;
uniform vec3 uColor;

const vec2 SIZE = vec2(16.);

vec3 greyscale(vec3 color, float strength) {
    float g = dot(color, vec3(0.299, 0.587, 0.114));
    return mix(color, vec3(g), strength);
}

vec3 greyscale(vec3 color) {
    return greyscale(color, 1.0);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 cell = resolution / uCellSize;
    vec2 grid = 1.0 / cell;
    vec2 pixelizedUV = grid * (0.5 + floor(uv / grid));
    vec4 pixelized = texture2D(inputBuffer, pixelizedUV);
    float greyscaled = greyscale(pixelized.rgb).r;

    if (uInvert) {
        greyscaled = 1.0 - greyscaled;
    }

    float characterIndex = floor((uCharactersCount - 1.0) * greyscaled);
    vec2 characterPosition = vec2(mod(characterIndex, SIZE.x), floor(characterIndex / SIZE.y));
    vec2 offset = vec2(characterPosition.x, -characterPosition.y) / SIZE;
    vec2 charUV = mod(uv * (cell / SIZE), 1.0 / SIZE) - vec2(0., 1.0 / SIZE) + offset;
    vec4 asciiCharacter = texture2D(uCharacters, charUV);

    asciiCharacter.rgb = uColor * asciiCharacter.r;
    asciiCharacter.a = pixelized.a;
    outputColor = asciiCharacter;
}
`;class Qt extends W{constructor({font:t="arial",characters:o=" .:,'-^=*+?!|0#X%WM@",fontSize:r=54,cellSize:a=16,color:n="#ffffff",invert:i=!1}={}){const s=/*@__PURE__*/new Map([["uCharacters",new y(new ye)],["uCellSize",new y(a)],["uCharactersCount",new y(o.length)],["uColor",new y(new Pe(n))],["uInvert",new y(i)]]);super("ASCIIEffect",Jt,{uniforms:s});const l=this.uniforms.get("uCharacters");l&&(l.value=this.createCharactersTexture(o,t,r))}createCharactersTexture(t,o,r){const a=document.createElement("canvas"),n=1024,i=16,s=n/i;a.width=a.height=n;const l=new be(a,void 0,Y,Y,re,re),p=a.getContext("2d");if(!p)throw new Error("Context not available");p.clearRect(0,0,n,n),p.font=`${r}px ${o}`,p.textAlign="center",p.textBaseline="middle",p.fillStyle="#fff";for(let _=0;_<t.length;_++){const S=t[_],g=_%i,d=Math.floor(_/i);p.fillText(S,g*s+s/2,d*s+s/2)}return l.needsUpdate=!0,l}}const eo=/*@__PURE__*/B(({font:e="arial",characters:t=" .:,'-^=*+?!|0#X%WM@",fontSize:o=54,cellSize:r=16,color:a="#ffffff",invert:n=!1},i)=>{const s=z(()=>new Qt({characters:t,font:e,fontSize:o,cellSize:r,color:a,invert:n}),[t,o,r,a,n,e]);return /*@__PURE__*/w("primitive",{ref:i,object:s})}),to={fragmentShader:`
    uniform float factor;

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
      vec2 vUv = uv;
      float frequency = 6.0 * factor;
      float amplitude = 0.015 * factor;
      float x = vUv.y * frequency + time * 0.7; 
      float y = vUv.x * frequency + time * 0.3;
      vUv.x += cos(x + y) * amplitude * cos(y);
      vUv.y += sin(x - y) * amplitude * cos(y);
      vec4 rgba = texture(inputBuffer, vUv);
      outputColor = rgba;
    }
  `};class de extends W{constructor({blendFunction:t=23,factor:o=0}={}){super("WaterEffect",to.fragmentShader,{blendFunction:t,attributes:2,uniforms:/*@__PURE__*/new Map([["factor",new y(o)]])})}}const oo=/*@__PURE__*/P(de,{blendFunction:23}),ao=/*@__PURE__*/B(({halfRes:e,screenSpaceRadius:t,quality:o,depthAwareUpsampling:r=!0,aoRadius:a=5,aoSamples:n=16,denoiseSamples:i=4,denoiseRadius:s=12,distanceFalloff:l=1,intensity:p=1,color:_,renderMode:S=0},g)=>{const{camera:d,scene:m}=V(),v=z(()=>new ut(m,d),[d,m]);return L(()=>{Ce(v.configuration,{color:_,aoRadius:a,distanceFalloff:l,intensity:p,aoSamples:n,denoiseSamples:i,denoiseRadius:s,screenSpaceRadius:t,renderMode:S,halfRes:e,depthAwareUpsampling:r})},[t,_,a,l,p,n,i,s,S,e,r,v]),L(()=>{o&&v.setQualityMode(o.charAt(0).toUpperCase()+o.slice(1))},[v,o]),/*@__PURE__*/w("primitive",{ref:g,object:v})});export{eo as ASCII,ht as Autofocus,wt as Bloom,St as BrightnessContrast,yt as ChromaticAberration,Pt as ColorAverage,bt as ColorDepth,Et as Depth,ce as DepthOfField,Rt as DotScreen,dt as EffectComposer,D as EffectComposerContext,Nt as FXAA,Ut as Glitch,Ct as GodRays,zt as Grid,Tt as HueSaturation,Zt as LUT,gt as LensFlare,fe as LensFlareEffect,ao as N8AO,At as Noise,Bt as Outline,Vt as Pixelation,Ot as Ramp,pe as RampEffect,ue as RampType,Lt as SMAA,It as SSAO,Ft as Scanline,mt as Select,pt as Selection,kt as SelectiveBloom,Gt as Sepia,Ht as ShockWave,Wt as Texture,$t as TiltShift,Yt as TiltShift2,me as TiltShiftEffect,Xt as ToneMapping,qt as Vignette,oo as WaterEffect,de as WaterEffectImpl,k as resolveRef,H as selectionContext,Z as useVector2,P as wrapEffect};
//# sourceMappingURL=index.js.map

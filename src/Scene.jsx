import {useEffect,useRef} from 'react'
import * as T from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js'
import {EGGS,byId} from './data/eggs'
import {CONFIG} from './config'

const PI=Math.PI,clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,rnd=(a,b)=>a+Math.random()*(b-a);
const backOut=t=>{const c=1.9;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)}

export default function Scene({variety}){
  const mount=useRef(null),vr=useRef(variety);vr.current=variety;
  useEffect(()=>{
    const R=new T.WebGLRenderer({antialias:true,alpha:true});
    R.setPixelRatio(Math.min(devicePixelRatio,2));R.outputColorSpace=T.SRGBColorSpace;R.toneMapping=T.ACESFilmicToneMapping;R.toneMappingExposure=1.1;
    R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;R.useLegacyLights=true;
    mount.current.appendChild(R.domElement);
    const S=new T.Scene();S.fog=new T.Fog(0xf6e4c2,10,36);
    S.environment=new T.PMREMGenerator(R).fromScene(new RoomEnvironment(),.04).texture;
    const cam=new T.PerspectiveCamera(36,1,.1,100);
    S.add(new T.HemisphereLight(0xcfe3ff,0x6b8a3a,.8));
    const sun=new T.DirectionalLight(0xfff0d0,1.6);sun.position.set(-5,8,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
    Object.assign(sun.shadow.camera,{left:-10,right:10,top:8,bottom:-8,near:1,far:30});sun.shadow.bias=-.0004;sun.shadow.radius=4;S.add(sun);

    const tex=(w,h,draw,rep)=>{const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;if(rep)t.repeat.set(rep[0],rep[1]);t.anisotropy=8;t.colorSpace=T.SRGBColorSpace;return t};
    const M=o=>new T.MeshStandardMaterial({roughness:.9,envMapIntensity:.35,...o});

    // ground + grass
    const gT=tex(512,512,(g,w,h)=>{g.fillStyle='#4f7a2b';g.fillRect(0,0,w,h);for(let i=0;i<9000;i++){g.strokeStyle=`hsl(${rnd(78,105)},${rnd(35,60)}%,${rnd(22,45)}%)`;g.lineWidth=rnd(1,2);const x=rnd(0,w),y=rnd(0,h);g.beginPath();g.moveTo(x,y);g.lineTo(x+rnd(-3,3),y-rnd(4,12));g.stroke()}},[30,30]);
    const ground=new T.Mesh(new T.PlaneGeometry(120,120),M({map:gT}));ground.rotation.x=-PI/2;ground.receiveShadow=true;S.add(ground);
    {const N=7000,im=new T.InstancedMesh(new T.ConeGeometry(.018,.34,3,1).translate(0,.17,0),M({}),N),d=new T.Object3D(),c=new T.Color();let n=0;
     while(n<N){const x=rnd(-14,14),z=rnd(-8,7.5);if(Math.abs(z)<.6||(Math.abs(x)<4.4&&z>1&&z<4.4))continue;
      d.position.set(x,0,z);d.rotation.set(rnd(-.25,.25),rnd(0,6),rnd(-.25,.25));d.scale.set(1,rnd(.6,z<-1?2.2:1.3),1);d.updateMatrix();im.setMatrixAt(n,d.matrix);im.setColorAt(n,c.setHSL(rnd(.22,.29),rnd(.4,.65),rnd(.2,.38)));n++}
     S.add(im)}

    // ===== HEN =====
    const fea=tex(512,512,(g,w,h)=>{g.fillStyle='#8a4a1c';g.fillRect(0,0,w,h);for(let y=-10;y<h+20;y+=13)for(let x=-10;x<w+20;x+=17){const ox=(y/13%2)*8;g.fillStyle=`hsl(${rnd(18,32)},65%,${rnd(30,52)}%)`;g.beginPath();g.ellipse(x+ox,y,10,14,0,0,7);g.fill();g.strokeStyle='rgba(40,18,5,.45)';g.lineWidth=1.5;g.stroke();g.fillStyle='rgba(255,220,160,.18)';g.beginPath();g.ellipse(x+ox-2,y-4,5,6,0,0,7);g.fill()}},[3,2]);
    const fm=M({map:fea,bumpMap:fea,bumpScale:2.5}),wm=M({map:fea,bumpMap:fea,bumpScale:2.5,color:0xd9a878}),tm=M({map:fea,bumpMap:fea,bumpScale:2,color:0x5a4640}),red=M({color:0xc4151c,roughness:.4}),beak=M({color:0xe5a21a,roughness:.35}),legM=M({color:0xdca62a,roughness:.5}),eye=M({color:0x050505,roughness:.05}),ring=M({color:0xe8892a,roughness:.4}),ear=M({color:0xf2ece0});
    const sph=new T.SphereGeometry(1,40,28),H=new T.Group(),proc=new T.Group();H.add(proc);S.add(H);
    const ell=(m,sx,sy,sz,x,y,z,p)=>{const o=new T.Mesh(sph,m);o.scale.set(sx,sy,sz);o.position.set(x,y,z);o.castShadow=true;(p||proc).add(o);return o};
    ell(fm,1.0,.72,.66,0,.98,0);ell(fm,.62,.64,.56,.62,.88,0);ell(fm,.7,.52,.56,-.58,1.02,0);ell(fm,.3,.58,.26,.98,1.42,0).rotation.z=-.3;
    [1,-1].forEach(s=>{const w=ell(wm,.62,.42,.12,0,1.0,s*.6);w.rotation.z=-.12;w.rotation.y=-s*.08});
    for(let i=0;i<6;i++){const g=new T.Group();g.position.set(-.95,1.02,(i-2.5)*.035);g.rotation.z=PI-(.3+i*.17);proc.add(g);const f=new T.Mesh(sph,tm);f.scale.set(.58,.15,.04);f.position.x=.52;f.castShadow=true;g.add(f)}
    const hd=new T.Group();proc.add(hd);
    ell(fm,.21,.21,.18,1.16,1.9,0,hd);
    const bk=new T.Mesh(new T.ConeGeometry(.075,.22,16),beak);bk.rotation.z=-PI/2;bk.position.set(1.4,1.86,0);bk.castShadow=true;hd.add(bk);
    [[1.06,.07],[1.14,.09],[1.23,.075],[1.3,.05]].forEach(([x,r],i)=>ell(red,r,r*1.5,r*.55,x,2.1+(i==1?.02:0),0,hd));
    ell(red,.045,.12,.035,1.31,1.71,0,hd);
    [1,-1].forEach(s=>{ell(eye,.034,.034,.034,1.27,1.93,s*.15,hd);ell(ring,.05,.05,.03,1.265,1.93,s*.145,hd);ell(ear,.04,.055,.02,1.12,1.84,s*.17,hd)});
    const legs=[1,-1].map(z=>{const g=new T.Group();g.position.set(.1,.62,z*.24);proc.add(g);ell(fm,.2,.3,.15,0,-.02,0,g);
      const sh=new T.Mesh(new T.CylinderGeometry(.03,.037,.52,10),legM);sh.position.y=-.34;sh.castShadow=true;g.add(sh);
      [-.3,0,.3,PI].forEach(a=>{const tg=new T.Group();tg.position.set(0,-.6,0);tg.rotation.y=a;g.add(tg);const t=new T.Mesh(new T.CylinderGeometry(.017,.023,a==PI?.14:.26,8),legM);t.rotation.z=PI/2;t.position.x=a==PI?.06:.12;t.castShadow=true;tg.add(t)});return g});
    // optional realistic model
    let mixer=null;
    new GLTFLoader().load(CONFIG.henModel,g=>{
      const o=g.scene,b=new T.Box3().setFromObject(o),sz=b.getSize(new T.Vector3()),k=CONFIG.henLength/Math.max(sz.x,sz.z,.001);
      const w=new T.Group();o.scale.setScalar(k);o.rotation.y=CONFIG.henRotationY;w.add(o);w.updateMatrixWorld(true);
      const b2=new T.Box3().setFromObject(w);o.position.y=-b2.min.y;o.traverse(m=>{if(m.isMesh){m.castShadow=true}});
      proc.visible=false;H.add(w);window.__eggzyRealHen=true;
      if(g.animations.length){mixer=new T.AnimationMixer(o);mixer.clipAction(g.animations[0]).play()}
    },undefined,()=>{});

    // ===== EGGS =====
    const eggMat=v=>{const t=tex(256,256,(g,w,h)=>{g.fillStyle=v.shell;g.fillRect(0,0,w,h);for(let i=0;i<14;i++){g.fillStyle=`rgba(${v.speck},.07)`;g.beginPath();g.arc(rnd(0,w),rnd(0,h),rnd(10,40),0,7);g.fill()}
      for(let i=0;i<3000;i++){g.fillStyle=`rgba(${v.speck},${rnd(.03,.14)})`;g.fillRect(rnd(0,w),rnd(0,h),rnd(1,3),rnd(1,3))}
      for(let i=0;i<v.blotch*160;i++){g.fillStyle=`rgba(${v.speck},${rnd(.25,.7)})`;g.beginPath();g.ellipse(rnd(0,w),rnd(0,h),rnd(1,v.blotch*3.5),rnd(1,v.blotch*3),rnd(0,3),0,7);g.fill()}});
      return new T.MeshPhysicalMaterial({map:t,bumpMap:t,bumpScale:.5,roughness:.45,clearcoat:.3,clearcoatRoughness:.45,envMapIntensity:.5})};
    const mats={};EGGS.forEach(v=>mats[v.id]=eggMat(v));
    const ep=[];for(let i=0;i<=40;i++){const t=i/40*PI,y=-Math.cos(t);ep.push(new T.Vector2(Math.sin(t)*(1-.16*y)*.15,y*.21))}
    const eg=new T.LatheGeometry(ep,48);
    const mkEgg=ty=>{const m=new T.Mesh(eg,mats[ty]);m.castShadow=true;S.add(m);return m};

    // ===== TRAY (30 eggs) =====
    const pulp=tex(256,256,(g,w,h)=>{g.fillStyle='#bfb59f';g.fillRect(0,0,w,h);for(let i=0;i<5000;i++){g.fillStyle=`rgba(80,70,50,${rnd(.03,.12)})`;g.fillRect(rnd(0,w),rnd(0,h),rnd(1,5),1)}},[2,2]);
    const pm=M({map:pulp,side:T.DoubleSide,roughness:1}),tray=new T.Group(),slots=[],COLS=6,ROWS=5;
    const sh=new T.Shape();sh.moveTo(-1.32,-1.12);sh.lineTo(1.32,-1.12);sh.lineTo(1.32,1.12);sh.lineTo(-1.32,1.12);
    for(let i=0;i<30;i++){const x=(i%COLS-2.5)*.4,z=(Math.floor(i/COLS)-2)*.4;slots.push(new T.Vector3(x,.1,z));const h=new T.Path();h.absarc(x,-z,.19,0,PI*2,true);sh.holes.push(h)}
    const trayM=new T.Mesh(new T.ExtrudeGeometry(sh,{depth:.04,bevelEnabled:false,curveSegments:20}),pm);trayM.rotation.x=-PI/2;trayM.castShadow=trayM.receiveShadow=true;tray.add(trayM);
    const cups=new T.InstancedMesh(new T.LatheGeometry([[.19,0],[.18,-.06],[.14,-.17],[.08,-.23],[.001,-.24]].map(p=>new T.Vector2(...p)),20),pm,30),dm=new T.Object3D();
    slots.forEach((s,i)=>{dm.position.set(s.x,0,s.z);dm.updateMatrix();cups.setMatrixAt(i,dm.matrix)});cups.castShadow=cups.receiveShadow=true;tray.add(cups);
    const TS=.8,trayEggs=new T.InstancedMesh(eg,mats.brown,30);trayEggs.instanceMatrix.setUsage(T.DynamicDrawUsage);trayEggs.castShadow=true;tray.add(trayEggs);
    const rj=slots.map(()=>({r:rnd(0,6),t:rnd(-.05,.05)}));
    tray.scale.setScalar(TS);tray.position.set(2,.45,9);S.add(tray);
    const board=new T.Mesh(new T.BoxGeometry(3.4,.14,2.9),M({color:0x8a6038,roughness:.8}));board.receiveShadow=board.castShadow=true;S.add(board);

    // ===== LOOP =====
    const eggs=[],plan=[{t:9.6,type:'brown'},{t:13.0,type:'white'}],seg=[[0,-5.6],[9,1.9],[10.6,1.9],[12.2,2.9]];
    let t0=performance.now(),last=t0,mx=0,my=0,lay=0,raf,fill={v:null,phase:'idle',t0:0,next:null,started:false};
    const onMove=e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5};addEventListener('pointermove',onMove);
    const resize=()=>{R.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()};addEventListener('resize',resize);resize();
    const v3=new T.Vector3(),look=new T.Vector3(),quat=new T.Quaternion(),eul=new T.Euler(),one=new T.Vector3(),sc=new T.Vector3(),P0=new T.Vector3(0,1,6.6),L0=new T.Vector3(0,1.25,0);
    const loop=now=>{
      const dt=Math.min((now-last)/1000,.05);last=now;const t=Math.max((now-t0)/1000-.5,0);
      // hen path
      let hx=seg[seg.length-1][1],walk=false;for(let i=1;i<seg.length;i++)if(t<seg[i][0]){const a=seg[i-1],b=seg[i],k=(t-a[0])/(b[0]-a[0]);hx=a[1]+(b[1]-a[1])*k;walk=b[1]!==a[1];break}
      const ph=t*7.5;lay=Math.max(0,lay-dt);
      H.position.x=hx;H.position.y=(walk?Math.abs(Math.sin(ph))*.04:0)-Math.sin(clamp(lay/.8)*PI)*.08;H.rotation.z=walk?Math.sin(ph)*.015:0;
      legs[0].rotation.z=walk?Math.sin(ph)*.5:0;legs[1].rotation.z=walk?-Math.sin(ph)*.5:0;
      const pk=!walk&&t>14?Math.pow(Math.max(0,Math.sin(t*2.4)),6):0;
      hd.position.x=(walk?Math.sin(ph)*.05:0)+pk*.18;hd.position.y=(walk?Math.abs(Math.cos(ph))*-.025:0)-pk*.45;hd.rotation.z=-pk*.5;
      if(mixer)mixer.update(walk?dt:0);
      if(plan.length&&t>=plan[0].t){const p=plan.shift(),m=mkEgg(p.type);m.position.set(hx-.95,.8,0);lay=.8;eggs.push({m,ty:p.type,vy:0,landed:false,home:new T.Vector3(),f:0,sy:rnd(-.5,.5)})}
      // scroll state
      const sy=scrollY,vh=innerHeight,el=document.getElementById('showcase'),sTop=el?el.offsetTop:vh,p=clamp((sy-vh*.35)/(sTop+vh*.55-vh*.35));
      const portrait=cam.aspect<1,sl=ease(clamp((p-.1)/.5)),cm=ease(clamp(p/.6));
      const tx=portrait?0:2.05;tray.position.set(tx,.45+.07,2.7+(9-2.7)*(1-sl)*1);board.position.set(tx,.07,tray.position.z);
      const cur=vr.current,L1=portrait?new T.Vector3(0,.2,1.9):new T.Vector3(-.15,.2,2.5),P1=portrait?new T.Vector3(0,5.4,7.2):new T.Vector3(-.15,5,6.2);
      // eggs
      tray.updateMatrixWorld(true);
      eggs.forEach(e=>{
        if(!e.landed){e.vy-=6*dt;e.m.position.y+=e.vy*dt;e.m.rotation.z+=(1.45-e.m.rotation.z)*clamp(dt*5);e.m.rotation.y=e.sy;
          if(e.m.position.y<=.15){e.m.position.y=.15;if(e.vy<-.9)e.vy*=-.3;else{e.landed=true;e.home.copy(e.m.position);e.hr=1.45}}}
        else{const target=(p>.62&&e.ty===cur)?1:0;e.f+=Math.sign(target-e.f)*Math.min(Math.abs(target-e.f),dt/1.3);const f=ease(e.f);
          if(f>0){const tp=tray.localToWorld(slots[0].clone());e.m.position.lerpVectors(e.home,tp,f);e.m.position.y+=Math.sin(PI*f)*1.6;e.m.rotation.z=e.hr+(PI-e.hr)*f;e.m.rotation.y=e.sy*(1-f);e.m.scale.setScalar(1-(1-TS)*f)}
          else{e.m.position.copy(e.home);e.m.rotation.z=e.hr;e.m.rotation.y=e.sy;e.m.scale.setScalar(1)}}});
      // tray fill state machine
      if(p>.7&&!fill.started){fill={...fill,started:true,v:cur,phase:'in',t0:now};trayEggs.material=mats[cur]}
      else if(fill.started){
        if(fill.phase==='in'&&cur!==fill.v){fill.phase='out';fill.t0=now;fill.next=cur}
        else if(fill.phase==='out'){if(cur!==fill.next)fill.next=cur;if((now-fill.t0)>420){fill.v=fill.next;trayEggs.material=mats[fill.v];fill.phase='in';fill.t0=now}}}
      const vd=byId(fill.v||cur),u=(now-fill.t0)/1000,flying=eggs.some(e=>e.ty===fill.v&&e.f>.6);
      slots.forEach((s,i)=>{let k=0;if(fill.started)k=fill.phase==='out'?1-ease(clamp(u/.4)):backOut(clamp((u-i*.035)/.5));if(i===0&&flying)k=0;
        const y=.1*vd.scale+.01;dm.position.set(s.x,y,s.z);eul.set(0,rj[i].r,PI+rj[i].t);dm.quaternion.setFromEuler(eul);dm.scale.setScalar(Math.max(k,0.0001)*vd.scale);dm.updateMatrix();trayEggs.setMatrixAt(i,dm.matrix)});
      trayEggs.instanceMatrix.needsUpdate=true;
      // camera
      const kk=Math.min(Math.max(1,1.4/cam.aspect),2.3);
      cam.position.lerpVectors(P0,P1,cm);look.lerpVectors(L0,L1,cm);v3.copy(cam.position).sub(look).multiplyScalar(kk);cam.position.copy(look).add(v3);
      cam.position.x+=mx*.5;cam.position.y+=-my*.25;cam.lookAt(look);
      R.render(S,cam);raf=requestAnimationFrame(loop)};
    raf=requestAnimationFrame(loop);
    return()=>{cancelAnimationFrame(raf);removeEventListener('resize',resize);removeEventListener('pointermove',onMove);R.dispose();R.domElement.remove()}
  },[]);
  return <div ref={mount} className="scene"/>
}

import {useEffect,useRef,useState} from 'react'
import {EGGS} from './data/eggs'
import {CONFIG} from './config'
import {Reveal,Count,useInView} from './hooks.jsx'
const money=n=>CONFIG.currency+n.toLocaleString('en-IN')
const Egg=({c,s=1})=><span className="eggcss" style={{'--c':c,'--s':s}}/>

export function Hero(){return <header className="hero"><div className="htxt"><h1>Eggzy</h1><p>Honest eggs · Laid this morning</p></div><div className="hint"><i/>Scroll</div></header>}

export function Showcase({v,setId,add}){
  const [on,setOn]=useState(false),max={protein:7,calories:90,fat:6,omega:350};
  useEffect(()=>{const f=()=>{const r=document.getElementById('showcase').getBoundingClientRect();setOn(r.top<innerHeight*.3&&r.bottom>innerHeight*.8)};f();addEventListener('scroll',f,{passive:true});return()=>removeEventListener('scroll',f)},[]);
  const lbl={protein:['Protein','g'],calories:['Calories','kcal'],fat:['Fat','g'],omega:['Omega-3','mg']};
  return <section id="showcase"><div className="stage">
    <div className={'info glass '+(on?'on':'')}><div className="swap" key={v.id}>
      <span className="tag">{v.tag}</span><h2>{v.name} Eggs</h2><p>{v.about}</p>
      <ul className="why">{v.why.map((w,i)=><li key={w} style={{animationDelay:i*120+'ms'}}><b>✓</b>{w}</li>)}</ul>
      <div className="bars">{Object.entries(v.stats).map(([k,val])=><div key={k}><span>{lbl[k][0]}<em>{val} {lbl[k][1]}</em></span><i><u style={{width:Math.min(100,val/max[k]*100)+'%'}}/></i></div>)}</div>
      <div className="buy"><b>{money(v.price)}<small> / tray of 30</small></b><button className="btn" onClick={()=>add(v.id)}>Add to cart</button></div>
    </div></div>
    <div className={'picker '+(on?'on':'')}>{EGGS.map(e=><button key={e.id} className={e.id===v.id?'act':''} onClick={()=>setId(e.id)}><Egg c={e.shell} s={.45}/>{e.name}</button>)}</div>
  </div></section>
}

export function Journey(){
  const ref=useRef(),[p,setP]=useState(0),S=[['🌾','Fed naturally','Grain, greens and clean water.'],['🐔','Laid daily','Free-roaming hens, no cages.'],['🧺','Hand-sorted','Brown to brown, white to white.'],['🚚','At your door','Delivered within 48 hours.']];
  useEffect(()=>{const f=()=>{const r=ref.current.getBoundingClientRect();setP(Math.min(1,Math.max(0,(innerHeight*.85-r.top)/(r.height*.9))))};f();addEventListener('scroll',f,{passive:true});return()=>removeEventListener('scroll',f)},[]);
  return <section className="sec" ref={ref}><Reveal as="h2">From the farm to your tray</Reveal>
    <div className="journey"><svg viewBox="0 0 1000 120" preserveAspectRatio="none"><path className="bg" d="M0 60C120 0 220 120 333 60S560 0 666 60 900 120 1000 60"/><path className="fg" pathLength="1" style={{strokeDashoffset:1-p}} d="M0 60C120 0 220 120 333 60S560 0 666 60 900 120 1000 60"/></svg>
    <div className="steps">{S.map((s,i)=><div key={i} className={'step '+(p>(i+.4)/4?'on':'')}><div className="node">{s[0]}</div><h3>{s[1]}</h3><p>{s[2]}</p></div>)}</div></div></section>
}

const icons=[
 <svg viewBox="0 0 64 64" key="a"><circle className="spin" cx="32" cy="32" r="12" fill="#f2b134"/>{[...Array(8)].map((_,i)=><line className="spin" key={i} x1="32" y1="6" x2="32" y2="14" stroke="#f2b134" strokeWidth="4" strokeLinecap="round" transform={`rotate(${i*45} 32 32)`}/>)}</svg>,
 <svg viewBox="0 0 64 64" key="b"><g className="sway" stroke="#c98a1b" strokeWidth="3" fill="#e8b84a"><path d="M32 60V20" fill="none"/>{[0,1,2,3].map(i=><ellipse key={i} cx={i%2?38:26} cy={18+i*7} rx="5" ry="3" transform={`rotate(${i%2?-30:30} ${i%2?38:26} ${18+i*7})`}/>)}</g></svg>,
 <svg viewBox="0 0 64 64" key="c"><g className="drive"><rect x="6" y="22" width="32" height="22" rx="3" fill="#c98a1b"/><path d="M38 28h12l8 8v8H38z" fill="#e8b84a"/><circle cx="18" cy="46" r="6" fill="#2b190d"/><circle cx="48" cy="46" r="6" fill="#2b190d"/></g></svg>,
 <svg viewBox="0 0 64 64" key="d"><path className="pulse" d="M32 6l22 8v16c0 14-9 25-22 30C19 55 10 44 10 30V14z" fill="#6aa84f"/><path d="M22 32l8 8 14-16" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round"/></svg>]
export function Why(){const W=[['Sun-fed & free','Hens roam open pasture every day.'],['Natural feed','Grain, greens and flax, nothing artificial.'],['48-hour promise','Packed on lay-day and delivered fast.'],['Quality checked','Every egg candled and inspected.']];
  return <section className="sec"><Reveal as="h2">Why people choose Eggzy</Reveal><div className="grid4">{W.map((w,i)=><Reveal key={i} d={i*120} className="card tilt"><div className="ico">{icons[i]}</div><h3>{w[0]}</h3><p>{w[1]}</p></Reveal>)}</div></section>}

export function Nutrition({v}){
  const [r,vis]=useInView(.25),pct=Math.min(1,v.stats.protein/50*5),C=2*Math.PI*54;
  return <section className="sec" ref={r}><Reveal as="h2">Nutrition, visualised</Reveal>
   <div className="nut"><div className="ring"><svg viewBox="0 0 140 140"><circle cx="70" cy="70" r="54" className="t"/><circle cx="70" cy="70" r="54" className="f" style={{strokeDasharray:C,strokeDashoffset:vis?C*(1-pct*.99):C}}/></svg><div><b><Count to={v.stats.protein} dec={1}/>g</b><span>protein / egg</span></div></div>
   <div className="chart">{EGGS.map(e=><div key={e.id}><span>{e.name}</span><i><u style={{width:vis?e.stats.protein/7*100+'%':0,background:e.shell}}/></i><em><Count to={e.stats.protein} dec={1}/>g</em></div>)}</div>
   <div className="facts"><div><b><Count to={v.stats.calories}/></b>kcal</div><div><b><Count to={v.stats.omega}/></b>mg omega-3</div><div><b>13</b>essential nutrients</div></div></div></section>
}

export function Shop({cart,add}){
  const items=EGGS.filter(e=>cart[e.id]),total=items.reduce((s,e)=>s+cart[e.id]*e.price,0);
  const msg=encodeURIComponent('Hi Eggzy! I would like to order:\n'+items.map(e=>`${cart[e.id]} × ${e.name} tray (30) – ${money(cart[e.id]*e.price)}`).join('\n')+`\nTotal: ${money(total)}`);
  return <section className="sec" id="shop"><Reveal as="h2">Pick your tray</Reveal>
   <div className="shop">{EGGS.map((e,i)=><Reveal key={e.id} d={i*90} className="prod"><Egg c={e.shell}/><h3>{e.name}</h3><p>{e.tag}</p><b>{money(e.price)}<small> / 30</small></b>
     <div className="qty"><button onClick={()=>add(e.id,-1)} aria-label="less">−</button><span>{cart[e.id]||0}</span><button onClick={()=>add(e.id,1)} aria-label="more">+</button></div></Reveal>)}</div>
   <div className={'cart '+(items.length?'on':'')}><div><b>{items.reduce((s,e)=>s+cart[e.id],0)} tray(s)</b> · Total <b>{money(total)}</b></div><a className="btn" target="_blank" rel="noreferrer" href={`https://wa.me/${CONFIG.whatsapp}?text=${msg}`}>Order on WhatsApp</a></div></section>
}

export function Reviews(){const R=[['Priya M.','The yolks are unreal. I can never go back to supermarket eggs.'],['Rahul S.','Omega-3 Gold is a game changer for my breakfast.'],['Anita K.','Delivered fresh, packed beautifully. The quail eggs are adorable!'],['Dev P.','Best value tray in the city. My kids love them.']];
  return <section className="sec wide"><Reveal as="h2" className="c">Loved at breakfast tables</Reveal><div className="marq"><div>{[...R,...R].map((r,i)=><div className="rev" key={i}><div>★★★★★</div><p>“{r[1]}”</p><b>{r[0]}</b></div>)}</div></div></section>}

export function Faq(){const Q=[['Are Eggzy eggs really fresh?','Eggs are packed on the day they are laid and delivered within 48 hours.'],['What is the difference between brown and white eggs?','Shell colour comes from the hen breed. Nutrition and taste are very similar; our brown eggs have a slightly richer yolk.'],['How should I store them?','Keep them refrigerated, pointed end down, and use within three weeks.'],['Can I order in bulk?','Yes, add multiple trays to the cart and send the order on WhatsApp.']];
  return <section className="sec narrow"><Reveal as="h2">Questions</Reveal>{Q.map((q,i)=><Reveal key={i} d={i*80}><details><summary>{q[0]}</summary><p>{q[1]}</p></details></Reveal>)}</section>}

export function Footer(){return <><Reveal className="cta"><h2>Crack open a better morning.</h2><a className="btn" href="#shop">Order Eggzy</a></Reveal><footer>© 2026 Eggzy · Honest eggs, laid this morning.</footer></>}

import {useState} from 'react'
import Scene from './Scene.jsx'
import {byId} from './data/eggs'
import {Hero,Showcase,Journey,Why,Nutrition,Shop,Reviews,Faq,Footer} from './sections.jsx'
export default function App(){
  const [id,setId]=useState('brown'),[cart,setCart]=useState({}),v=byId(id);
  const add=(i,d=1)=>setCart(c=>({...c,[i]:Math.max(0,(c[i]||0)+d)}));
  const n=Object.values(cart).reduce((a,b)=>a+b,0);
  return <>
    <Scene variety={id}/>
    <nav><div className="logo">Eggzy</div><div><a href="#showcase">Varieties</a><a href="#shop">Shop</a><a href="#shop" className="cartb">Cart · {n}</a></div></nav>
    <Hero/>
    <Showcase v={v} setId={setId} add={i=>{add(i);}}/>
    <div className="solid">
      <div className="strip"><div>{[...Array(2)].map((_,k)=><span key={k}>FREE RANGE ✦ LAID FRESH DAILY ✦ NO HORMONES ✦ HAND SORTED ✦ 48H DELIVERY ✦ </span>)}</div></div>
      <Journey/><Why/><Nutrition v={v}/><Shop cart={cart} add={add}/><Reviews/><Faq/><Footer/>
    </div>
  </>
}

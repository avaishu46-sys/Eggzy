// Add / edit varieties here – the 3D tray, info panel, charts and shop update automatically.
export const EGGS=[
{id:'brown',name:'Country Brown',tag:'The classic farm egg',shell:'#b8733f',speck:'230,190,140',blotch:0,scale:1,price:210,
 about:'Rich, hearty and full of flavour. Laid by free-roaming hens fed on natural grain, with a thick shell and a deep golden yolk.',
 why:['Deep golden, creamy yolk','Thick, strong shell','Perfect for every home recipe'],stats:{protein:6.5,calories:78,fat:5.3,omega:40}},
{id:'white',name:'Farm White',tag:'Clean, mild & everyday',shell:'#f4ecdf',speck:'150,130,100',blotch:0,scale:1,price:190,
 about:'Light, mild and consistently fresh. The everyday egg for breakfast, baking and meal-prep, packed the day it is laid.',
 why:['Mild, clean taste','Great for baking & whites-only recipes','Best value per tray'],stats:{protein:6.0,calories:72,fat:4.8,omega:35}},
{id:'omega',name:'Omega-3 Gold',tag:'Enriched with flax & greens',shell:'#d9a066',speck:'255,225,170',blotch:0,scale:1,price:290,
 about:'Our hens eat flaxseed and leafy greens, giving you an egg with up to nine times more omega-3 for heart and brain health.',
 why:['Up to 9× more omega-3','Vivid orange yolk','Heart & brain friendly'],stats:{protein:6.4,calories:80,fat:5.4,omega:350}},
{id:'organic',name:'Organic Speckled',tag:'Certified organic, pasture raised',shell:'#a36a42',speck:'70,40,20',blotch:1,scale:1,price:320,
 about:'From pasture-raised hens on certified organic feed. Naturally speckled shells and the cleanest, most honest taste.',
 why:['Certified organic feed','Pasture raised, no antibiotics','Naturally speckled shells'],stats:{protein:6.6,calories:76,fat:5.1,omega:90}},
{id:'quail',name:'Tiny Quail',tag:'Small, rich & elegant',shell:'#cdb99a',speck:'70,45,25',blotch:2,scale:.55,price:150,
 about:'Delicate little eggs with a rich yolk. Ideal for salads, snacks, ramen and elegant starters.',
 why:['Bite-sized and rich','Elegant for starters','High in vitamin B12'],stats:{protein:1.2,calories:14,fat:1.1,omega:20}}
]
export const byId=id=>EGGS.find(e=>e.id===id)||EGGS[0]

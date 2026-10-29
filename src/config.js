// Edit these to customise the site
export const CONFIG={
  brand:'Eggzy',
  whatsapp:'919999999999',          // WhatsApp number with country code, no +
  currency:'₹',
  // Optional realistic hen: put a .glb at public/models/hen.glb. If missing, the built-in 3D hen is used.
  henModel:import.meta.env.BASE_URL+'models/hen.glb',
  henLength:2.4,        // size of the model in scene units
  henRotationY:0        // rotate model so it faces right (try Math.PI, Math.PI/2, -Math.PI/2)
}

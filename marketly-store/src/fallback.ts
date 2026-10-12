import type { Product } from './catalog';
// Local data so the demo stays usable when the public API is unavailable.
export const sampleProducts: Product[] = [
  {id:101,title:'Ceramic Muse Vase',category:'home-decoration',price:49,rating:4.8,stock:24,thumbnail:'/illustrations/item-1.svg',description:'Sculptural ceramic vase with a natural matte finish.'},
  {id:102,title:'Ambient Table Lamp',category:'home-decoration',price:129,rating:4.9,stock:15,thumbnail:'/illustrations/item-2.svg',description:'Warm ambient lighting in a timeless silhouette.'},
  {id:103,title:'Soft Shape Armchair',category:'furniture',price:389,rating:4.7,stock:8,thumbnail:'/illustrations/item-3.svg',description:'Modern lounge chair with a comfortable rounded shape.'},
  {id:104,title:'Everyday Glass Set',category:'kitchen-accessories',price:42,rating:4.6,stock:42,thumbnail:'/illustrations/item-4.svg',description:'Minimal drinking glasses for daily moments.'},
  {id:105,title:'Morning Brew Cup',category:'kitchen-accessories',price:24,rating:4.8,stock:60,thumbnail:'/illustrations/item-5.svg',description:'Hand-finished stoneware mug with a gentle glaze.'},
  {id:106,title:'Botanical Skin Oil',category:'beauty',price:39,rating:4.5,stock:17,thumbnail:'/illustrations/item-6.svg',description:'A simple addition to your self-care routine.'},
  {id:107,title:'Classic Desk Clock',category:'home-decoration',price:68,rating:4.7,stock:33,thumbnail:'/illustrations/item-7.svg',description:'A modern desk clock with clean lines.'},
  {id:108,title:'Nordic Floor Lamp',category:'furniture',price:175,rating:4.9,stock:11,thumbnail:'/illustrations/item-8.svg',description:'Statement lighting that pairs with any room.'},
];

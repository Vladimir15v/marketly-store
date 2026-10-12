export type Product = { id: number; title: string; category: string; price: number; rating: number; thumbnail: string; description: string; stock: number };
export type CartItem = { id: number; quantity: number };
export type SortKey = 'featured' | 'price-low' | 'price-high' | 'rating';
export type DummyJSONResponse = { products: Product[] };
export const formatPrice = (price: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(price);
export function filterProducts(items: Product[], search: string, category: string, sort: SortKey, onlyFavorite: boolean, favorites: number[]) {
  let result = items.filter(p => (
    (category === 'all' || category === p.category)
    && (p.title + ' ' + p.description).toLowerCase().includes(search.trim().toLowerCase())
    && (!onlyFavorite || favorites.includes(p.id))
  ));
  if (sort === 'price-low') result = [...result].sort((a, b) => a.price - b.price);
  if (sort === 'price-high') result = [...result].sort((a, b) => b.price - a.price);
  if (sort === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);
  return result;
}
export function updateQuantity(items: CartItem[], id: number, diff: number): CartItem[] {
  const match = items.find(i => i.id === id);
  if (!match && diff > 0) return [...items, { id, quantity: diff }];
  return items.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + diff) } : i).filter(i => i.quantity > 0);
}
export function cartTotal(cart: CartItem[], products: Product[]) {
  return cart.reduce((sum, item) => sum + (products.find(p => p.id === item.id)?.price || 0) * item.quantity, 0);
}
export const categoryLabels: Record<string, string> = {
  all: 'Все категории', beauty: 'Красота', fragrances: 'Парфюмерия', furniture: 'Мебель', groceries: 'Продукты',
  'home-decoration': 'Для дома', 'kitchen-accessories': 'Кухня', laptops: 'Ноутбуки', smartphones: 'Смартфоны',
  tablets: 'Планшеты', 'mens-shirts': 'Мужская одежда', 'womens-dresses': 'Женская одежда', 'sports-accessories': 'Спорт',
};
export const prettyCategory = (name: string) => categoryLabels[name] || name.replaceAll('-', ' ');

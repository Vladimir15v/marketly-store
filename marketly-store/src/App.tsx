import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Heart, Menu, Minus, Plus, Search, ShieldCheck, ShoppingBag, SlidersHorizontal, Sparkles, Star, Truck, X } from 'lucide-react';
import { cartTotal, filterProducts, formatPrice, prettyCategory, updateQuantity } from './catalog';
import type { CartItem, Product, SortKey } from './catalog';
import { sampleProducts } from './fallback';

function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try { const cached = localStorage.getItem(key); return cached ? JSON.parse(cached) as T : initial; }
    catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private browsing may block localStorage */ } }, [key, value]);
  return [value, setValue] as const;
}
function useCatalog() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    fetch('https://dummyjson.com/products?limit=40', { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error(`API returned ${r.status}`); return r.json() as Promise<{ products: Product[] }>; })
      .then(data => { if (Array.isArray(data.products) && data.products.length > 0) setProducts(data.products); else setOffline(true); })
      .catch(() => { if (!controller.signal.aborted || controller.signal.reason !== 'unmount') setOffline(true); })
      .finally(() => { clearTimeout(timeout); setLoading(false); });
    return () => { controller.abort('unmount'); clearTimeout(timeout); };
  }, []);
  return { products, loading, offline };
}
function ProductImage({ p, ...props }: { p: Product; className?: string }) {
  const [error, setError] = useState(false);
  return error ? <div className={`image-fallback ${props.className || ''}`} aria-label={`Изображение ${p.title}`}><ShoppingBag size={37}/><small>MARKETLY / STUDIO</small></div> : <img {...props} src={p.thumbnail} alt={p.title} loading="lazy" onError={() => setError(true)}/>;
}
export default function App() {
  const { products, loading, offline } = useCatalog();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<SortKey>('featured');
  const [onlyFavorite, setOnlyFavorite] = useState(false);
  const [favorites, setFavorites] = useStoredState<number[]>('marketly.favorites.v1', []);
  const [cart, setCart] = useStoredState<CartItem[]>('marketly.cart.v1', []);
  const [cartOpen, setCartOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [toast, setToast] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const categories = useMemo(() => ['all', ...new Set(products.map(p => p.category))], [products]);
  const filtered = useMemo(() => filterProducts(products, query, category, sort, onlyFavorite, favorites), [products, query, category, sort, onlyFavorite, favorites]);
  const totalItems = cart.reduce((sum, v) => sum + v.quantity, 0);
  const subtotal = cartTotal(cart, products);
  useEffect(() => { if (!toast) return; const t = window.setTimeout(() => setToast(''), 3400); return () => clearTimeout(t); }, [toast]);
  const toggleFavorite = (id: number) => setFavorites(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const addToCart = (p: Product) => {
    if (cart.find(item => item.id === p.id)?.quantity === p.stock) { setToast('Достигнут доступный остаток товара'); return; }
    setCart(prev => updateQuantity(prev, p.id, 1));
    setToast(`${p.title} добавлен в корзину`);
  };
  const setCartCount = (id: number, delta: number) => {
    if (delta > 0 && (cart.find(item => item.id === id)?.quantity || 0) >= (products.find(p => p.id === id)?.stock || 0)) return;
    setCart(prev => updateQuantity(prev, id, delta));
  };
  const resetFilters = () => { setQuery(''); setCategory('all'); setSort('featured'); setOnlyFavorite(false); };
  return <div className="site">
    <div className="announcement">ДЕМО-МАГАЗИН · НИКАКИХ РЕАЛЬНЫХ ЗАКАЗОВ <span>✦</span> РАБОТАЕТ НА REACT + TYPESCRIPT</div>
    <header className="header"><div className="header-inner"><button className="hamburger" aria-label="Меню" onClick={() => setMenuOpen(!menuOpen)}><Menu size={22}/></button><button className="logo" onClick={resetFilters}>marketly<span>✳</span><small>CURATED EVERYDAY OBJECTS</small></button><nav className={`main-nav ${menuOpen ? 'open' : ''}`} aria-label="Главное меню"><button onClick={() => { resetFilters();setMenuOpen(false); }}>Все товары</button><button onClick={() => { setCategory('home-decoration');setOnlyFavorite(false);setMenuOpen(false);document.getElementById('catalog')?.scrollIntoView({ behavior:'smooth' }); }}>Для дома</button><button onClick={() => { setCategory('beauty');setOnlyFavorite(false);setMenuOpen(false);document.getElementById('catalog')?.scrollIntoView({ behavior:'smooth' }); }}>Красота</button></nav><div className="header-actions"><button aria-label="Избранное" className={onlyFavorite ? 'action-active' : ''} onClick={() => { setOnlyFavorite(!onlyFavorite);document.getElementById('catalog')?.scrollIntoView({ behavior:'smooth' }); }}><Heart size={21} fill={onlyFavorite ? 'currentColor' : 'none'}/><span className="count-mini">{favorites.length}</span></button><button aria-label="Открыть корзину" onClick={() => setCartOpen(true)}><ShoppingBag size={21}/><span className="count-bubble">{totalItems}</span></button></div></div></header>
    <main><div className="page-width"><section className="hero"><div className="hero-content"><div className="kicker"><Sparkles size={14}/> COLLECTION / 2026</div><h1>Вещи с характером.<br/><em>Для вашей жизни.</em></h1><p>Красивые детали на каждый день. Коллекция вдохновения, где функциональность встречает эстетику.</p><button className="hero-cta" onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>Смотреть коллекцию <ArrowRight size={18}/></button><span className="hero-foot">PROTOTYPE STOREFRONT / № 001</span></div><div className="hero-art"><div className="art-label">EST. MMXXVI</div><div className="art-circle"/><div className="art-vase"><div className="vase-neck"/><div className="vase-body"/><div className="vase-highlight"/></div><div className="art-shadow"/><div className="art-sign">01 — Objects of desire</div></div></section>
    <section className="promise-row" aria-label="Возможности демо"><div><Truck size={23}/><span><strong>Адаптивный интерфейс</strong><small>На телефоне и компьютере</small></span></div><div><ShieldCheck size={23}/><span><strong>Сохранение корзины</strong><small>Локально в браузере</small></span></div><div><Sparkles size={23}/><span><strong>Каталог через API</strong><small>И резервные данные офлайн</small></span></div></section>
    <section id="catalog" className="catalog"><div className="catalog-heading"><div><div className="section-kicker">THE COLLECTION</div><h2>Откройте своё <em>любимое.</em></h2><p>Кураторская подборка современных вещей — демонстрационный каталог.</p></div><span className="catalog-count">{filtered.length} товаров</span></div>
    <div className="toolbar"><div className="search-box"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск по товарам..." aria-label="Поиск товаров"/></div><label className="select-wrap"><SlidersHorizontal size={17}/><select aria-label="Категория" value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option value={c} key={c}>{prettyCategory(c)}</option>)}</select><ChevronDown size={14}/></label><label className="select-wrap"><span>Сортировка:</span><select aria-label="Сортировка" value={sort} onChange={e => setSort(e.target.value as SortKey)}><option value="featured">По умолчанию</option><option value="price-low">Сначала дешевле</option><option value="price-high">Сначала дороже</option><option value="rating">По рейтингу</option></select><ChevronDown size={14}/></label></div>
    {offline && <div className="api-alert">Публичный API недоступен. Показываем локальные демонстрационные товары — фильтры, корзина и избранное продолжают работать.</div>}
    {loading && <div className="loading-label"><span className="loader"/> Обновляем каталог через DummyJSON API...</div>}
    <div className="product-grid">{filtered.map((p, idx) => <article className="product-card" key={p.id}><div className="product-image-area"><button className={`heart-btn ${favorites.includes(p.id) ? 'liked' : ''}`} aria-label={favorites.includes(p.id) ? 'Убрать из избранного' : 'Добавить в избранное'} onClick={() => toggleFavorite(p.id)}><Heart size={19} fill={favorites.includes(p.id) ? 'currentColor' : 'none'}/></button>{idx % 5 === 0 && <span className="product-tag">PICK OF THE WEEK</span>}<button className="image-click" onClick={() => setSelected(p)} aria-label={`Открыть ${p.title}`}><ProductImage p={p}/></button><button className="quick-btn" onClick={() => setSelected(p)}>Подробнее <ArrowRight size={15}/></button></div><div className="product-body"><div className="product-meta"><span>{prettyCategory(p.category)}</span><span className="rating"><Star size={13} fill="currentColor"/> {p.rating.toFixed(1)}</span></div><button className="product-title" onClick={() => setSelected(p)}>{p.title}</button><div className="product-bottom"><strong>{formatPrice(p.price)}</strong><button aria-label={`В корзину: ${p.title}`} onClick={() => addToCart(p)}><Plus size={21}/></button></div></div></article>)}</div>
    {filtered.length === 0 && <div className="no-results"><Search size={30}/><h3>Ничего не найдено</h3><p>Попробуйте другой запрос или сбросьте фильтры.</p><button onClick={resetFilters}>Сбросить фильтры <ArrowRight size={17}/></button></div>}
    </section><section className="bottom-banner"><span>DESIGNED TO INSPIRE</span><h2>Маленькие детали.<br/><em>Большое настроение.</em></h2><button onClick={() => {resetFilters();document.getElementById('catalog')?.scrollIntoView({behavior:'smooth'});}}>Исследовать коллекцию <ArrowRight size={17}/></button></section></div></main>
    <footer><div className="page-width footer-inner"><strong>marketly✳</strong><span>Учебный frontend-проект. Товары, цены и заказы не являются коммерческим предложением.</span><span>React · TypeScript · REST API</span></div></footer>
    {cartOpen && <div className="overlay" onMouseDown={e => { if (e.target === e.currentTarget) setCartOpen(false); }}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Корзина"><div className="drawer-head"><div><span className="section-kicker">YOUR SELECTION</span><h2>Корзина <span>({totalItems})</span></h2></div><button className="circle-close" aria-label="Закрыть корзину" onClick={() => setCartOpen(false)}><X size={21}/></button></div><div className="cart-list">{cart.length ? cart.map(c => { const p=products.find(x => x.id === c.id);if(!p) return null;return <div className="cart-line" key={c.id}><ProductImage p={p}/><div className="cart-item-body"><strong>{p.title}</strong><small>{prettyCategory(p.category)}</small><b>{formatPrice(p.price * c.quantity)}</b><div className="qty"><button aria-label="Уменьшить" onClick={() => setCartCount(p.id,-1)}><Minus size={15}/></button><span>{c.quantity}</span><button aria-label="Увеличить" onClick={() => setCartCount(p.id,1)}><Plus size={15}/></button></div></div><button className="remove-item" aria-label={`Удалить ${p.title}`} onClick={() => setCart(prev => prev.filter(x => x.id !== p.id))}><X size={17}/></button></div>; }) : <div className="cart-empty"><ShoppingBag size={42}/><h3>Пока пусто</h3><p>Добавьте несколько понравившихся товаров.</p><button onClick={() => setCartOpen(false)}>Продолжить покупки</button></div>}</div><div className="drawer-bottom"><div className="drawer-total"><span>Итого</span><strong>{formatPrice(subtotal)}</strong></div><p>Демо-режим: оплата и отправка реальных заказов отсутствуют.</p><button className="checkout" disabled={!cart.length} onClick={() => { setCart([]);setCartOpen(false);setToast('Демо-заказ создан! Настоящая оплата не производилась.'); }}>Создать демо-заказ <ArrowRight size={18}/></button></div></aside></div>}
    {selected && <div className="overlay modal-layer" onMouseDown={e => { if (e.target === e.currentTarget) setSelected(null); }}><div className="quick-modal" role="dialog" aria-modal="true" aria-label={`Информация о ${selected.title}`}><button className="circle-close modal-close" onClick={() => setSelected(null)} aria-label="Закрыть"><X size={21}/></button><ProductImage p={selected}/><div className="modal-info"><span className="section-kicker">{prettyCategory(selected.category)}</span><h2>{selected.title}</h2><div className="rating"><Star size={15} fill="currentColor"/>{selected.rating.toFixed(1)} / 5</div><p>{selected.description}</p><strong>{formatPrice(selected.price)}</strong><small>В наличии: {selected.stock} шт.</small><button className="checkout" onClick={() => {addToCart(selected);setSelected(null);}}>Добавить в корзину <ShoppingBag size={18}/></button><button className="back" onClick={() => setSelected(null)}><ArrowLeft size={15}/> К каталогу</button></div></div></div>}
    {toast && <div className="toast" role="status"><Check size={18}/>{toast}<button aria-label="Закрыть уведомление" onClick={() => setToast('')}><X size={16}/></button></div>}
  </div>;
}

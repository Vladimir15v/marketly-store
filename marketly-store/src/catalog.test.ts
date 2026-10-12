import { describe, expect, it } from 'vitest';
import { sampleProducts } from './fallback';
import { cartTotal, filterProducts, updateQuantity } from './catalog';
describe('product catalog', () => {
  it('filters by category and query', () => {
    const matches = filterProducts(sampleProducts, 'lamp', 'home-decoration', 'featured', false, []);
    expect(matches).toHaveLength(1);
    expect(matches[0].title).toBe('Ambient Table Lamp');
  });
  it('sorts without mutating source', () => {
    const original = [...sampleProducts];
    const sorted = filterProducts(sampleProducts, '', 'all', 'price-low', false, []);
    expect(sorted[0].price).toBe(24);
    expect(sampleProducts).toEqual(original);
  });
  it('supports favorites filter', () => {
    expect(filterProducts(sampleProducts, '', 'all', 'featured', true, [103]).map(p => p.id)).toEqual([103]);
  });
  it('adds, updates, and removes cart items', () => {
    const added = updateQuantity([], 101, 1);
    expect(updateQuantity(added, 101, 2)).toEqual([{id:101,quantity:3}]);
    expect(updateQuantity(added, 101, -1)).toEqual([]);
    expect(cartTotal(added, sampleProducts)).toBe(49);
  });
});

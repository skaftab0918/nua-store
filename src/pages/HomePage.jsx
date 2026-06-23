import { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard/ProductCard';
import { SkeletonCard } from '../components/Skeleton/Skeleton';
import styles from './HomePage.module.scss';

const CATEGORIES = ['all', "women's clothing", "men's clothing", 'electronics', 'jewelery'];

export default function HomePage() {
  const { products, loading, error } = useProducts();
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <main className={styles.page}>
      <div className="container">
        {/* Hero strip */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>New Arrivals</h1>
          <p className={styles.heroSub}>Curated essentials for everyday life</p>
        </section>

        {/* Category filter */}
        <div className={styles.filterBar} role="navigation" aria-label="Filter by category">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ''}`}
              aria-pressed={activeCategory === cat}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className={styles.error} role="alert">
            <p>Couldn't load products. Check your connection and try again.</p>
            <button onClick={() => window.location.reload()} className={styles.retryBtn}>
              Retry
            </button>
          </div>
        )}

        {/* Grid */}
        <div className={styles.grid}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map(product => <ProductCard key={product.id} product={product} />)
          }
        </div>

        {!loading && !error && filtered.length === 0 && (
          <p className={styles.empty}>No products in this category.</p>
        )}
      </div>
    </main>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { getVariantsForProduct, getThumbnailsForProduct } from '../data/variants';
import { ColourSelector, SizeSelector } from '../components/VariantSelector/VariantSelector';
import QuantityPicker from '../components/QuantityPicker/QuantityPicker';
import { SkeletonDetail } from '../components/Skeleton/Skeleton';
import { useCart } from '../context/CartContext';
import styles from './ProductDetailPage.module.scss';

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  );
}

function AddedToast({ visible }) {
  return (
    <div className={`${styles.toast} ${visible ? styles.toastVisible : ''}`} role="status" aria-live="polite">
      ✓ Added to cart
    </div>
  );
}

// Fake sale prices for some products — spec mentions "sale price with original crossed out"
function getSalePrice(product) {
  // Give ~30% of products a sale — deterministic based on id
  if (product.id % 3 === 0) {
    const original = +(product.price * 1.25).toFixed(2);
    return { sale: product.price, original };
  }
  return { sale: null, original: product.price };
}

export default function ProductDetailPage() {
  const { id }                           = useParams();
  const [searchParams, setSearchParams]  = useSearchParams();
  const { product, loading, error }      = useProduct(id);
  const { addItem, openDrawer }          = useCart();

  const [activeImage, setActiveImage]    = useState(0);
  const [quantity, setQuantity]          = useState(1);
  const [toastVisible, setToastVisible]  = useState(false);
  const [addLoading, setAddLoading]      = useState(false);

  // Derived variant data (only available once product loads)
  const variants    = product ? getVariantsForProduct(product.id) : null;
  const thumbnails  = product ? getThumbnailsForProduct(product.image) : [];

  // Initialise selected colour + size from URL, or default to first available
  const [selectedColour, setSelectedColour] = useState(searchParams.get('colour') ?? '');
  const [selectedSize,   setSelectedSize]   = useState(searchParams.get('size')   ?? '');

  useEffect(() => {
    if (!variants) return;
    if (!selectedColour || !variants.colours.find(c => c.name === selectedColour)) {
      setSelectedColour(variants.colours[0].name);
    }
    if (!selectedSize || !variants.sizes.find(s => s.label === selectedSize)) {
      const first = variants.sizes.find(s => s.stock !== 'soldOut');
      setSelectedSize(first?.label ?? variants.sizes[0].label);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants]);

  // Sync selected variant → URL (deep-linkable)
  useEffect(() => {
    if (!selectedColour || !selectedSize) return;
    const next = new URLSearchParams();
    next.set('colour', selectedColour);
    next.set('size',   selectedSize);
    setSearchParams(next, { replace: true });
  }, [selectedColour, selectedSize, setSearchParams]);

  const selectedSizeData = variants?.sizes.find(s => s.label === selectedSize);
  const isSoldOut        = selectedSizeData?.stock === 'soldOut';
  const isLowStock       = selectedSizeData?.stock === 'low';

  // Simulated async add-to-cart with random failure (bonus spec)
  const handleAddToCart = useCallback(async () => {
    if (!product || isSoldOut) return;
    setAddLoading(true);
    await new Promise(res => setTimeout(res, 600 + Math.random() * 400));

    // Simulate ~15% failure rate
    if (Math.random() < 0.15) {
      setAddLoading(false);
      alert("Couldn't add to cart. Please try again.");
      return;
    }

    addItem(product, selectedColour, selectedSize, quantity);
    setAddLoading(false);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
    openDrawer();
  }, [product, isSoldOut, addItem, selectedColour, selectedSize, quantity, openDrawer]);

  const pricing = product ? getSalePrice(product) : null;

  return (
    <main className={styles.page}>
      <div className="container">
        <Link to="/" className={styles.breadcrumb}>
          <ChevronLeft /> Back to shop
        </Link>

        {loading && <SkeletonDetail />}

        {error && (
          <div className={styles.error} role="alert">
            <p>Product not found or couldn't be loaded.</p>
            <Link to="/" className={styles.errorLink}>← Back to shop</Link>
          </div>
        )}

        {product && !loading && (
          <div className={styles.layout}>
            {/* ── Left: image gallery ─────────────────────────────────────── */}
            <div className={styles.gallery}>
              <div className={styles.mainImageWrap}>
                <img
                  key={activeImage}
                  src={thumbnails[activeImage]}
                  alt={product.title}
                  className={styles.mainImage}
                />
              </div>

              {/* Thumbnails */}
              <div className={styles.thumbRail} role="list" aria-label="Product images">
                {thumbnails.map((src, i) => (
                  <button
                    key={i}
                    role="listitem"
                    onClick={() => setActiveImage(i)}
                    className={`${styles.thumb} ${activeImage === i ? styles.thumbActive : ''}`}
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={activeImage === i}
                  >
                    <img src={src} alt="" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>

            {/* ── Right: product info ──────────────────────────────────────── */}
            <div className={styles.info}>
              <p className={styles.category}>{product.category}</p>
              <h1 className={styles.title}>{product.title}</h1>

              {/* Price */}
              <div className={styles.priceRow}>
                <span className={styles.price}>${pricing.original.toFixed(2)}</span>
                {pricing.sale && (
                  <>
                    <span className={styles.salePrice}>${pricing.sale.toFixed(2)}</span>
                    <span className={styles.saleBadge}>Sale</span>
                  </>
                )}
              </div>

              {/* Stock notice */}
              {isLowStock && !isSoldOut && (
                <p className={styles.stockLow} role="status">Only a few left</p>
              )}
              {isSoldOut && (
                <p className={styles.stockOut} role="status">This size is sold out</p>
              )}

              <hr className={styles.divider} />

              {/* Variant selectors */}
              {variants && (
                <div className={styles.variantBlock}>
                  <ColourSelector
                    colours={variants.colours}
                    selected={selectedColour}
                    onChange={setSelectedColour}
                  />
                  <SizeSelector
                    sizes={variants.sizes}
                    selected={selectedSize}
                    onChange={setSelectedSize}
                  />
                </div>
              )}

              {/* Quantity + CTA */}
              <div className={styles.ctaRow}>
                <QuantityPicker value={quantity} onChange={setQuantity} max={isSoldOut ? 0 : 10} />
                <button
                  className={styles.addBtn}
                  onClick={handleAddToCart}
                  disabled={isSoldOut || addLoading}
                  aria-busy={addLoading}
                >
                  {addLoading ? 'Adding…' : isSoldOut ? 'Sold Out' : 'Add to Cart'}
                </button>
              </div>

              <hr className={styles.divider} />

              {/* Description */}
              <div className={styles.description}>
                <h2 className={styles.descTitle}>About this product</h2>
                <p className={styles.descText}>{product.description}</p>
              </div>

              {/* Rating */}
              {product.rating && (
                <div className={styles.rating} aria-label={`Rated ${product.rating.rate} out of 5`}>
                  <span className={styles.ratingStars} aria-hidden="true">
                    {'★'.repeat(Math.round(product.rating.rate))}{'☆'.repeat(5 - Math.round(product.rating.rate))}
                  </span>
                  <span className={styles.ratingCount}>{product.rating.count} reviews</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <AddedToast visible={toastVisible} />
    </main>
  );
}

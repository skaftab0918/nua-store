import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getVariantsForProduct } from '../../data/variants';
import styles from './ProductCard.module.scss';

export default function ProductCard({ product }) {
  const { addItem, openDrawer } = useCart();

  const variants = getVariantsForProduct(product.id);
  const defaultColour = variants.colours[0].name;
  const defaultSize   = variants.sizes.find(s => s.stock !== 'soldOut')?.label ?? variants.sizes[0].label;

  function handleQuickAdd(e) {
    e.preventDefault(); // don't navigate
    addItem(product, defaultColour, defaultSize, 1);
    openDrawer();
  }

  return (
    <article className={styles.card}>
      <Link
        to={`/product/${product.id}`}
        className={styles.imageLink}
        aria-label={`View ${product.title}`}
        tabIndex="-1"
      >
        <div className={styles.imageWrap}>
          <img
            src={product.image}
            alt={product.title}
            className={styles.image}
            loading="lazy"
            width={400}
            height={400}
          />
        </div>
      </Link>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.category}>{product.category}</span>
        </div>

        <Link to={`/product/${product.id}`} className={styles.titleLink}>
          <h2 className={styles.title}>{product.title}</h2>
        </Link>

        <div className={styles.footer}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          <button
            className={styles.quickAdd}
            onClick={handleQuickAdd}
            aria-label={`Quick add ${product.title} to cart`}
          >
            + Add
          </button>
        </div>
      </div>
    </article>
  );
}

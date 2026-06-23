import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import styles from './Navbar.module.scss';

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}

export default function Navbar() {
  const { totalItems, openDrawer } = useCart();

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} aria-label="Nua – home">
          nua
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <Link to="/" className={styles.navLink}>Shop</Link>
        </nav>

        <button
          className={styles.cartBtn}
          onClick={openDrawer}
          aria-label={`Open cart, ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
        >
          <CartIcon />
          {totalItems > 0 && (
            <span className={styles.badge} aria-hidden="true">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

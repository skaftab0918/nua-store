import { useEffect, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import styles from './CartDrawer.module.scss';

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
  );
}

function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <li className={styles.item}>
      <div className={styles.itemThumb}>
        <img src={item.image} alt={item.title} loading="lazy" />
      </div>

      <div className={styles.itemInfo}>
        <p className={styles.itemTitle}>{item.title}</p>
        <p className={styles.itemVariant}>
          {item.colour} · {item.size}
        </p>
        <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>

        <div className={styles.itemActions}>
          <div className={styles.qtyControl} role="group" aria-label="Quantity">
            <button
              onClick={() => updateQuantity(item.key, item.quantity - 1)}
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1}
            >
              −
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.key, item.quantity + 1)}
              aria-label="Increase quantity"
              disabled={item.quantity >= 10}
            >
              +
            </button>
          </div>

          <button
            className={styles.removeBtn}
            onClick={() => removeItem(item.key)}
            aria-label={`Remove ${item.title}`}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </li>
  );
}

export default function CartDrawer() {
  const { items, drawerOpen, closeDrawer, subtotal, grandTotal, shippingFree } = useCart();
  const closeRef = useRef(null);
  const firstFocusableRef = useRef(null);

  // Focus trap + close on Escape
  useEffect(() => {
    if (!drawerOpen) return;

    const prev = document.activeElement;
    closeRef.current?.focus();

    function onKey(e) {
      if (e.key === 'Escape') closeDrawer();
    }
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus();
    };
  }, [drawerOpen, closeDrawer]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${drawerOpen ? styles.backdropVisible : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ''}`}
        aria-label="Shopping cart"
        aria-hidden={!drawerOpen}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <h2 className={styles.title}>
            Cart
            {items.length > 0 && <span className={styles.count}>{items.length}</span>}
          </h2>
          <button ref={closeRef} className={styles.closeBtn} onClick={closeDrawer} aria-label="Close cart">
            <CloseIcon />
          </button>
        </div>

        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <p>Your cart is empty.</p>
              <button className={styles.continueShopping} onClick={closeDrawer}>
                Continue shopping
              </button>
            </div>
          ) : (
            <ul className={styles.itemList}>
              {items.map(item => <CartItem key={item.key} item={item} />)}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            {!shippingFree && (
              <p className={styles.shippingNote}>
                Add ${(50 - subtotal).toFixed(2)} more for free shipping
              </p>
            )}
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>{shippingFree ? <span className={styles.free}>Free</span> : '$4.99'}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
            <button className={styles.checkoutBtn}>
              Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

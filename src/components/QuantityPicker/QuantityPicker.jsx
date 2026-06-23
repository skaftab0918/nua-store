import styles from './QuantityPicker.module.scss';

export default function QuantityPicker({ value, onChange, min = 1, max = 10 }) {
  return (
    <div className={styles.picker} role="group" aria-label="Quantity">
      <button
        className={styles.btn}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className={styles.value} aria-live="polite" aria-atomic="true">
        {value}
      </span>
      <button
        className={styles.btn}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

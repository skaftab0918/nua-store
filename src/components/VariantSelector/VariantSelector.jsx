import styles from './VariantSelector.module.scss';

export function ColourSelector({ colours, selected, onChange }) {
  return (
    <div className={styles.section}>
      <p className={styles.label}>
        Colour: <span className={styles.selectedLabel}>{selected}</span>
      </p>
      <div className={styles.swatches} role="radiogroup" aria-label="Select colour">
        {colours.map(c => (
          <button
            key={c.name}
            role="radio"
            aria-checked={selected === c.name}
            aria-label={c.name}
            className={`${styles.swatch} ${selected === c.name ? styles.swatchActive : ''}`}
            style={{ '--swatch-color': c.hex }}
            onClick={() => onChange(c.name)}
            title={c.name}
          />
        ))}
      </div>
    </div>
  );
}

export function SizeSelector({ sizes, selected, onChange }) {
  return (
    <div className={styles.section}>
      <p className={styles.label}>Size</p>
      <div className={styles.sizes} role="radiogroup" aria-label="Select size">
        {sizes.map(s => {
          const isSoldOut  = s.stock === 'soldOut';
          const isLowStock = s.stock === 'low';
          const isSelected = selected === s.label;

          return (
            <button
              key={s.label}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${s.label}${isLowStock ? ', low stock' : ''}${isSoldOut ? ', sold out' : ''}`}
              disabled={isSoldOut}
              onClick={() => onChange(s.label)}
              className={[
                styles.sizeBtn,
                isSelected  ? styles.sizeBtnActive   : '',
                isSoldOut   ? styles.sizeBtnSoldOut  : '',
                isLowStock  ? styles.sizeBtnLowStock : '',
              ].join(' ')}
            >
              {s.label}
              {isLowStock && <span className={styles.lowBadge}>Low</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

import styles from './Skeleton.module.scss';

export function SkeletonCard() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.image} />
      <div className={styles.body}>
        <div className={`${styles.line} ${styles.short}`} />
        <div className={`${styles.line} ${styles.long}`} />
        <div className={`${styles.line} ${styles.medium}`} />
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className={styles.detail} aria-hidden="true">
      <div className={styles.detailImage} />
      <div className={styles.detailBody}>
        <div className={`${styles.line} ${styles.short}`} />
        <div className={`${styles.line} ${styles.long}`} style={{ height: '2rem' }} />
        <div className={`${styles.line} ${styles.medium}`} />
        <div style={{ height: '1rem' }} />
        <div className={`${styles.line} ${styles.long}`} />
        <div className={`${styles.line} ${styles.long}`} />
        <div className={`${styles.line} ${styles.medium}`} />
      </div>
    </div>
  );
}

/**
 * Since FakeStoreAPI doesn't provide colour/size variants,
 * we generate deterministic variant data per product using its id.
 * This keeps the detail page spec-compliant without fabricating API calls.
 */

const COLOUR_POOLS = [
  [
    { name: 'Midnight', hex: '#1A1816' },
    { name: 'Stone',    hex: '#B5AFA6' },
    { name: 'Ivory',    hex: '#F5F2EB' },
  ],
  [
    { name: 'Rust',     hex: '#C4694F' },
    { name: 'Sage',     hex: '#7A9E87' },
    { name: 'Cream',    hex: '#EDE8DC' },
  ],
  [
    { name: 'Navy',     hex: '#1E3A5F' },
    { name: 'Blush',    hex: '#E8A8A0' },
    { name: 'Charcoal', hex: '#4A4845' },
  ],
  [
    { name: 'Forest',   hex: '#2D5A3D' },
    { name: 'Sand',     hex: '#D4C4A8' },
    { name: 'Ebony',    hex: '#2C2825' },
  ],
];

const SIZE_POOLS = [
  ['XS', 'S', 'M', 'L', 'XL'],
  ['S',  'M', 'L', 'XL', 'XXL'],
  ['XS', 'S', 'M', 'L'],
  ['S',  'M', 'L'],
];

// Stock states: 'available' | 'low' | 'soldOut'
const STOCK_PATTERNS = [
  ['available', 'available', 'low',       'available', 'soldOut'],
  ['soldOut',   'available', 'available', 'low',       'available'],
  ['available', 'low',       'available', 'available'],
  ['available', 'available', 'soldOut',   'available'],
];

/**
 * Returns stable variant data for a given product id.
 */
export function getVariantsForProduct(id) {
  const idx = (id - 1) % 4;
  const colours = COLOUR_POOLS[idx];
  const sizes   = SIZE_POOLS[idx];
  const stocks  = STOCK_PATTERNS[idx];

  return {
    colours,
    sizes: sizes.map((label, i) => ({
      label,
      stock: stocks[i] ?? 'available',
    })),
  };
}


export function getThumbnailsForProduct(primaryImage) {
  
  return [primaryImage, primaryImage, primaryImage];
}

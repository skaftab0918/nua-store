# Nua Store — Frontend Assignment

A mini e-commerce web app built with React 18, SCSS Modules, and Vite.

**Live URL: https://nua-store-eight.vercel.app/** 

---

## Setup

```bash
# Requires Node 18+
git clone <https://github.com/skaftab0918/nua-store.gitl>
cd nua-store
npm install
npm run dev
```

App runs at `http://localhost:5173`.

```bash
npm run build    # Production build
npm run preview  # Preview production build locally
```

---

## Project Structure

```
src/
├── components/
│   ├── CartDrawer/         # Slide-in cart panel (JSX + SCSS module)
│   ├── Navbar/             # Fixed top nav with cart badge
│   ├── ProductCard/        # Grid card with Quick Add
│   ├── QuantityPicker/     # +/- quantity control
│   ├── Skeleton/           # Loading skeletons for list + detail
│   └── VariantSelector/    # Colour swatches + size buttons
├── context/
│   └── CartContext.jsx     # useReducer cart + localStorage persistence
├── data/
│   └── variants.js         # Deterministic variant/thumbnail data per product
├── hooks/
│   └── useProducts.js      # useFetch wrappers for FakeStore API
├── pages/
│   ├── HomePage.jsx        # Product listing grid with category filter
│   └── ProductDetailPage.jsx
├── router/
│   └── index.jsx           # createBrowserRouter setup
└── styles/
    ├── _variables.scss     # Design tokens (colours, type, spacing)
    ├── _global.scss        # Reset + base styles
    └── main.scss
docs/
└── lighthouse.png
DECISIONS.md
```

---

## Design Decisions

- **Context API** for cart state — shallow, single-owner state; no external dependency needed.
- **SCSS Modules** — scoped class names per component; shared tokens via `_variables.scss`.
- **Deterministic variant data** — FakeStoreAPI has no colour/size data. `src/data/variants.js` generates stable variants per product `id` without inventing API calls.
- **URL variant state** — `?colour=Stone&size=M` search params make the detail page deep-linkable.
- **Simulated async Add to Cart** — 600–1000 ms delay, 15% random failure, loading state on button.



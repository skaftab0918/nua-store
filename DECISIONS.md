
## Architectural decision: Context API vs Zustand for cart state

I could have gone either way here.

**The case for Zustand:** less boilerplate, built-in devtools support, and it avoids
the re-render performance pitfall you get when a large context value changes. For a
real store with dozens of cart operations across deeply nested trees, Zustand (or
Redux Toolkit) would be the better call.

**Why I went with Context + useReducer:** the cart state is a single flat object — an
array of items, a drawer toggle, and some derived totals. Only three components read
it: the Navbar badge, the CartDrawer, and the detail page CTA. The number of consumers
is small, the state shape is shallow, and adding Zustand would have meant an external
dependency for no real gain at this scale.

If the product list grew to hundreds of items or the cart logic expanded (promo codes,
address state, multi-step checkout), I would migrate to Zustand at that point.

---
## Gap in spec: "Brand" field on the product detail page

The spec lists "product name, brand, price" on the detail page, but FakeStoreAPI
has no brand field — only category. I made the call to display the category
(e.g. "women's clothing", "electronics") in the brand position rather than
leaving it blank or inventing fake brand names. In a real codebase I would
either enrich the product data with a brands lookup table keyed by product id,
or request the field from the backend team.


## What I would clean up with more time

**TypeScript.** Skipped to hit the deadline. Adding it would take 1–2 hours: typing
the product/cart shapes, narrowing the variant data functions, and getting proper event
handler types on the SCSS-module components.

**Real image gallery.** The thumbnails are the same image repeated three times because
FakeStoreAPI provides only one URL per product. In production I would store three angle
URLs per product in a lookup table or use a real product API. The data source
(`src/data/variants.js`) is isolated so it is easy to swap out.

**Lighthouse performance score.** The build ships ~307 kB JS (97 kB gzipped), mostly
React + React Router. I would add route-based code splitting (`React.lazy + Suspense`)
to defer the detail page bundle, and preload the two Google Fonts with
`font-display: swap` to reduce LCP. On the Vercel deployment the cache and image
delivery warnings resolve automatically.

**Bonus unit tests.** I did not complete the variant selector tests under time pressure.
I would write them with Vitest + Testing Library, covering: sold-out size button is
`disabled`, CTA is `disabled` when a sold-out size is selected, and quantity is capped
at 10.
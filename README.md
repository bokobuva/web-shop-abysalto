# Web Shop

A production-grade e-commerce SPA built with Next.js (App Router), TypeScript, Redux, and TanStack Query. Features product filtering, sorting, search, pagination, authentication, and cart functionality.

---

## Setup

### Prerequisites

- Node.js 20+
- npm (or yarn, pnpm, bun)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd web-shop-abysalto

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm test` | Run Jest tests |
| `npm run storybook` | Start Storybook (port 6006) |

---

## Architecture

### Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Redux Toolkit + TanStack Query

### Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout, providers
│   ├── page.tsx           # Home page
│   ├── providers/         # Context providers (Auth, Cart, Query, Redux)
│   ├── services/          # API clients (products, categories, auth)
│   └── shared/            # Constants, types
├── components/             # React components (with __tests__, *.stories)
├── hooks/                  # Custom hooks (useAuth, useProductModal, etc.)
├── lib/                    # Pure utilities (filters, sort, search, pagination, auth)
└── store/                  # Redux slices and selectors
```

### Data Flow

1. **Server state:** TanStack Query fetches products and categories; `useSyncProductsToRedux` syncs them into Redux for filtering, sorting, and pagination.
2. **Client state:** Redux holds filters, sort, search, cart, auth. Selectors compose pure functions (`filterProducts`, `sortProducts`, `searchProducts`, `paginate`) into derived data.
3. **Routing:** Product details are driven by URL search params; `useProductModal` reads params and selects the product from the store.

---

## Husky & Pre-commit Checks

Every commit runs **Husky** with **lint-staged**, so only staged files are checked.

### What runs on commit

1. **ESLint** — Lint and auto-fix (`.ts`, `.tsx`)
2. **Prettier** — Format code
3. **Jest** — Run tests for changed files (`jest --bail --findRelatedTests`)

### Why it matters

- **Catch issues early:** Lint and test errors block commits instead of reaching CI.
- **Fast feedback:** lint-staged runs only on staged files, keeping pre-commit quick.
- **Shared standards:** Everyone commits code that passes the same checks.

Husky is configured in `.husky/pre-commit`; lint-staged rules live in `package.json`.

---

## Security: Token Management

This app handles authentication and tokens with explicit security measures.

### Token Storage

Access and refresh tokens are stored in **sessionStorage**.

- **vs. httpOnly cookies:** Direct DummyJSON calls from the browser cannot set cookies on our domain; httpOnly cookies would need a backend proxy.
- **vs. localStorage:** sessionStorage is cleared when the tab closes, shortening the exposure window.
- **vs. regular cookies:** Same XSS risk as sessionStorage; sessionStorage avoids cookie parsing and domain/SameSite configuration.

For production, use a **backend proxy** and **httpOnly cookies** to reduce XSS risk.

### Transport & Lifecycle

- **HTTPS** in production for all API calls.
- **Proactive refresh** before expiry (via JWT decoding).
- **No token logging**; tokens are never in URLs or error messages.
- **Authorization header** for authenticated requests.

### Recommendations

- Use a **backend proxy** to set httpOnly cookies.
- Add **CSP**, **X-Frame-Options**, and **HSTS** in production.
- Add **rate limiting** and **CAPTCHA** on login.

---

## Testing

### Strategy

**Logical layer (Jest):** Pure functions, hooks, and store logic. Tests are fast and focused.

**UI layer (Jest + Storybook):** Component behavior and visual states. Storybook documents components and uses the a11y addon for accessibility checks.

### Logical tests (Jest)

- **Unit:** Pure functions in `lib/` (e.g. `filterProducts`, `sortProducts`, `searchProducts`, `paginate`).
- **Integration:** Hooks (e.g. `useAuth`, `useProductModal`) with mocked dependencies.
- **Integration:** Components with Redux (e.g. `LoginForm`, `ConnectedProductsGrid`, `AddToCartControls`).

Tests live in `__tests__` next to the source files. Jest uses jsdom and Testing Library.

### UI tests (Storybook)

- Stories for all major components.
- `@storybook/addon-a11y` for accessibility checks while developing.
- Stories as component documentation and visual regression base.

### Running tests

```bash
npm test              # Jest
npm run storybook     # Storybook (http://localhost:6006)
```

### References

- [Jest](https://jestjs.io/docs/getting-started)
- [Storybook](https://storybook.js.org/docs)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## Accessibility

Accessibility is built in, not bolted on.

### Practices

- **Labels:** `aria-label` on interactive elements (selects, buttons, inputs).
- **Relationships:** `aria-labelledby`, `aria-describedby` for dialogs and forms.
- **Live regions:** `aria-live`, `role="alert"` for errors; `role="status"` for loading.
- **Screen readers:** `sr-only` labels where visual context is enough.
- **Keyboard:** Logical tab order; Dropdown uses `tabIndex={0}` and `aria-expanded`.

### Validation

- **Storybook addon-a11y** for automated checks during development.
- **ESLint** with accessibility-focused rules where applicable.
- **Semantic HTML:** Headings, landmarks (`role="main"`, `role="navigation"`), sections with `aria-label`.

### References

- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Storybook a11y addon](https://storybook.js.org/addons/@storybook/addon-a11y)

---

## Code Philosophy: Readability Over Minimization

We prefer clear, maintainable code over clever or heavily minimized implementations.

### Example: `sortProducts`

Sort options and logic are driven by a **single source of truth** (`SORT_OPTIONS` in constants).

**Before (switch-based):**

```ts
switch (sortOptionId) {
  case "price-asc": return sorted.sort((a, b) => a.price - b.price);
  case "price-desc": return sorted.sort((a, b) => b.price - a.price);
  // ... duplicated IDs, new sorts require changes in multiple places
}
```

**After (configuration-driven):**

```ts
const selectedOption = SORT_OPTIONS.find((option) => option.id === sortOptionId);
const canSort = selectedOption && "sortBy" in selectedOption && "order" in selectedOption;
if (!canSort || !selectedOption) return products;

const { sortBy, order } = selectedOption;
return sortedCopy.sort((productA, productB) =>
  compareProductValues(productA[sortBy], productB[sortBy], order),
);
```

Benefits:

- **Single source of truth:** Add a new sort by adding one object to `SORT_OPTIONS`.
- **Readable naming:** `selectedOption`, `productA`/`productB`, `compareProductValues` instead of `a`, `b`, inline logic.
- **Easier maintenance:** No switch to keep in sync with the dropdown.

---

## State Management

### Redux (client state)

- **Filters:** Category slug, price range
- **Sort:** `sortOptionId`
- **Search:** Query text
- **Pagination:** Current page
- **Cart:** Items and quantities
- **Auth:** User, loading, error

Selectors (`store/selectors.ts`) compose pure functions into derived state so UI components stay simple.

### TanStack Query (server state)

- Products and categories fetch, cache, and refetch.
- `useSyncProductsToRedux` syncs query results into Redux for client-side filtering, sorting, and pagination.

### References

- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TanStack Query](https://tanstack.com/query/latest)

---

## Additional Practices

- **TypeScript:** Typed across the codebase; shared types in `app/shared/types.ts`.
- **Path aliases:** `@/` maps to `src/` for simpler imports.
- **Co-location:** Tests and stories sit next to components and modules.
- **Pure functions:** Logic in `lib/` is side-effect free and unit tested.
- **Suspense:** Components using `useSearchParams` are wrapped in `Suspense` with loading fallbacks.

---

## Deploy

Deploy to [Vercel](https://vercel.com) or any Node.js host. Use `npm run build` and `npm start` for production.

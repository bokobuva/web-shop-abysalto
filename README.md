# Web Shop

A production-grade e-commerce SPA built with Next.js (App Router), TypeScript, Redux, and TanStack Query. Features product filtering, sorting, search, pagination, authentication, and cart functionality.

## Getting Started

Prerequisites: Node.js 20+

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test credentials (DummyJSON)

| Username | Password |
|----------|----------|
| `emilys` | `emilyspass` |

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm test` | Run Jest tests |
| `npm run storybook` | Start Storybook (port 6006) |

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State:** Redux Toolkit + TanStack Query
- **Testing:** Jest + React Testing Library, Storybook with addon-a11y
- **Pre-commit:** Husky + lint-staged (ESLint, Prettier, Jest)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout, providers
│   ├── page.tsx           # Home page
│   ├── providers/         # Auth, Cart, Query, Redux
│   ├── services/          # API clients (products, categories, auth)
│   └── shared/            # Constants, types
├── components/            # React components (with __tests__, *.stories)
├── hooks/                 # useAuth, useProductModal, useSyncProductsToRedux
├── lib/                   # Pure utilities (filters, sort, search, pagination, auth)
└── store/                 # Redux slices and selectors
```

## Security: Token Management

Access and refresh tokens are stored in **sessionStorage** because we call DummyJSON directly from the browser. httpOnly cookies would require a backend proxy. sessionStorage clears when the tab closes, reducing exposure compared to localStorage.

For production, use a **backend proxy** and **httpOnly cookies**. See [ARCHITECTURE.md](ARCHITECTURE.md) for full security details.

## Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** — Tech stack, data flow, auth, product listing, cart, Husky, security, accessibility
- **[TESTS.md](TESTS.md)** — Test coverage details (~220 tests across 34 files)
- JSDoc on shared utilities and services for editor IntelliSense

# Test Coverage

## Setup

The test suite uses Jest with React Testing Library and jsdom as the DOM environment.

Configuration:
- `jest.config.ts` — test runner config, path alias `@/` → `src/`
- `src/__mocks__/jest.setup.ts` — global setup, `@testing-library/jest-dom`
- `src/__mocks__/next/image.tsx` — mock for Next.js Image component

Run tests:
```bash
npm test
```

Watch mode:
```bash
npm run test:watch
```

**34 test files, ~220 tests**

---

## Services

### auth (`src/app/services/__tests__/auth.test.ts`) — 8 tests

| Test | Description |
|------|-------------|
| returns user and tokens on success | Login stores tokens and returns user |
| throws with API error message on failure | Error message from API on invalid credentials |
| throws generic message when API returns non-JSON error | Fallback for non-JSON error body |
| returns user when token is valid | getMe with valid token |
| throws when response is not ok | getMe error handling |
| returns new tokens and updates storage | refreshToken success |
| throws when refresh fails | refreshToken failure |
| clears tokens | logout clears storage |

### products (`src/app/services/__tests__/products.test.ts`) — 6 tests

| Test | Description |
|------|-------------|
| returns mapped products on successful fetch | Products mapped to Product type |
| uses images[0] when thumbnail is missing | Thumbnail fallback |
| uses empty string for image when thumbnail and images are missing | Empty fallback |
| throws when response is not ok | Error on failed fetch |
| returns empty array when API returns no products | Empty response handling |
| maps multiple products correctly | Multiple product mapping |

### categories (`src/app/services/__tests__/categories.test.ts`) — 3 tests

| Test | Description |
|------|-------------|
| returns mapped categories on successful fetch | Categories mapped to Category type |
| throws when response is not ok | Error on failed fetch |
| returns empty array when API returns no categories | Empty response handling |

---

## Lib (Pure Utilities)

### filterProducts (`src/lib/filters/__tests__/filterProducts.test.ts`) — 13 tests

| Test | Description |
|------|-------------|
| returns true when categorySlug is null | No category filter |
| returns true when product category matches | Category match |
| returns false when product category does not match | Category mismatch |
| returns true when priceRangeId is null | No price filter |
| filters 10-50 range correctly (10 <= price < 50) | Price range 10-50 |
| filters 50-100 range correctly (50 <= price < 100) | Price range 50-100 |
| filters 100+ range correctly | Price range 100+ |
| returns undefined when products is undefined | Undefined input |
| returns all products when no filters applied | No filters |
| filters by category only | Category filter only |
| filters by price range only | Price filter only |
| filters by both category and price range | Combined filters |
| returns empty array when no products match | No matches |

### sortProducts (`src/lib/sort/__tests__/sortProducts.test.ts`) — 8 tests

| Test | Description |
|------|-------------|
| returns same order for default | Default sort unchanged |
| sorts by price ascending (low to high) | Price asc |
| sorts by price descending (high to low) | Price desc |
| sorts by name A to Z | Name asc |
| sorts by name Z to A | Name desc |
| does not mutate input array | Immutability |
| returns empty array when input is empty | Empty input |
| returns undefined when products is undefined | Undefined input |

### searchProducts (`src/lib/search/__tests__/searchProducts.test.ts`) — 6 tests

| Test | Description |
|------|-------------|
| returns undefined when products is undefined | Undefined input |
| returns all products when searchQuery is empty | Empty search |
| filters by name case-insensitively | Case-insensitive match |
| filters by partial match | Partial match |
| trims search query | Trimmed query |
| returns empty array when no match | No matches |

### paginate (`src/lib/pagination/__tests__/paginate.test.ts`) — 7 tests

| Test | Description |
|------|-------------|
| returns undefined when items is undefined | Undefined input |
| returns empty array when items is empty | Empty input |
| returns first page slice | First page |
| returns second page slice | Second page |
| returns partial last page when items do not fill page | Partial last page |
| returns empty array when page is beyond range | Out-of-range page |
| handles single page | Single page |

### tokenStorage (`src/lib/auth/__tests__/tokenStorage.test.ts`) — 5 tests

| Test | Description |
|------|-------------|
| returns null when no tokens stored | No tokens |
| returns tokens when both are stored | Both tokens present |
| returns null when only access token is stored | Incomplete pair |
| stores both tokens | setTokens |
| removes tokens | clearTokens |

### jwtUtils (`src/lib/auth/__tests__/jwtUtils.test.ts`) — 5 tests

| Test | Description |
|------|-------------|
| returns exp from valid JWT payload | Valid token |
| returns null for invalid token format | Invalid format |
| returns null for malformed payload | Malformed base64 |
| returns null when exp is missing | Missing exp |
| returns null when exp is not a number | Invalid exp type |

### cartStorage (`src/lib/cart/__tests__/cartStorage.test.ts`) — 5 tests

| Test | Description |
|------|-------------|
| returns empty array when nothing stored | Empty storage |
| returns parsed items when valid JSON stored | Valid JSON |
| returns empty array when invalid JSON | Invalid JSON |
| filters invalid items | Item validation |
| stores items | setStoredCart |

---

## Store

### selectors (`src/store/__tests__/selectors.test.ts`) — 28 tests

| Test | Description |
|------|-------------|
| returns undefined when products.items is undefined | Undefined products |
| returns all products when no filters | No filters |
| filters by category when set | Category filter |
| filters by price range when set | Price filter |
| returns empty when no match | No matches |
| selectProducts returns items | Direct selector |
| selectCategories returns undefined when items is undefined | Undefined categories |
| selectCategories returns items after dispatch | Categories after load |
| returns current filter state | selectFilters |
| returns undefined when products.items is undefined | Paginated undefined |
| returns filtered products in default order when sort is default | Default sort |
| sorts by price ascending when price-asc | Sort price asc |
| sorts by price descending when price-desc | Sort price desc |
| sorts by name A-Z when name-asc | Sort name asc |
| sorts by name Z-A when name-desc | Sort name desc |
| filters by search query when set | Search filter |
| filters and sorts together | Combined filters + sort |
| selectPaginatedProducts returns first page when 25 products | First page |
| selectPaginatedProducts returns second page when currentPage is 2 | Second page |
| selectTotalFilteredCount returns full list length | Total count |
| selectTotalFilteredCount reflects filtered results | Filtered count |
| selectTotalPages returns 2 for 25 products with pageSize 20 | Total pages |
| selectShowPagination is true when filtered results > 20 | Show pagination |
| selectShowPagination is false when filtered results <= 20 | Hide pagination |
| returns product when id exists | selectProductById found |
| returns null when id does not exist | selectProductById not found |
| returns null when productId is null | selectProductById null |
| returns null when products.items is undefined | selectProductById undefined |

### authSlice (`src/store/__tests__/authSlice.test.ts`) — 8 tests

| Test | Description |
|------|-------------|
| has correct initial state | Initial state |
| setUser sets user and clears error when user is non-null | setUser success |
| setUser preserves error when clearing user | setUser clear |
| setUser with null clears user | setUser null |
| setAuthLoading updates loading state | Loading state |
| setAuthError updates error state | Error state |
| setAuthError with null clears error | Clear error |
| setAuthInitialized updates initialized state | Initialized state |

### cartSlice (`src/store/__tests__/cartSlice.test.ts`) — 8 tests

| Test | Description |
|------|-------------|
| has correct initial state | Initial state |
| addToCart adds new item | Add new |
| addToCart increments quantity for existing product | Increment existing |
| updateQuantity updates item | Update quantity |
| updateQuantity removes item when quantity is 0 | Remove on zero |
| removeFromCart removes item | Remove item |
| clearCart resets to empty | Clear cart |
| setCart replaces items | Replace items |

---

## Hooks

### useAuth (`src/hooks/__tests__/useAuth.test.tsx`) — 5 tests

| Test | Description |
|------|-------------|
| initializes as anonymous when no tokens | No tokens = anonymous |
| loads user when tokens exist | Valid tokens = user |
| login sets user on success | Login success |
| login sets error on failure | Login failure |
| logout clears user | Logout |

### useProductModal (`src/hooks/__tests__/useProductModal.test.tsx`) — 4 tests

| Test | Description |
|------|-------------|
| returns selectedProductId null and selectedProduct null when no query param | No param |
| returns selectedProduct when searchParams has product id | Product from param |
| openProduct calls router.replace with product param | openProduct |
| closeProduct calls router.replace without product param | closeProduct |

### useBackdropClick (`src/hooks/__tests__/useBackdropClick.test.ts`) — 3 tests

| Test | Description |
|------|-------------|
| returns a function | Return type |
| calls onClose when target equals currentTarget | Backdrop click |
| does not call onClose when target differs from currentTarget | Content click |

---

## Components

### LoginForm (`src/components/LoginForm/__tests__/LoginForm.test.tsx`) — 6 tests

| Test | Description |
|------|-------------|
| renders username and password inputs | Form fields |
| renders Log in and Cancel buttons | Buttons |
| submits with credentials | Submit flow |
| shows error when present | Error display |
| calls onClose when Cancel clicked | Cancel |
| shows error when login fails on submit | Integration error flow |

### NavBar (`src/components/NavBar/__tests__/NavBar.test.tsx`) — 6 tests

| Test | Description |
|------|-------------|
| shows Log in when user is null | Guest state |
| shows user name and Log out when authenticated | Auth state |
| calls logout when Log out clicked | Logout action |
| shows loading placeholder when not initialized | Loading state |
| shows cart badge when cart has items | Cart badge |
| hides cart badge when cart is empty | No badge |

### Sort (`src/components/Sort/__tests__/Sort.test.tsx`) — 4 tests

| Test | Description |
|------|-------------|
| renders Sort by label | Label |
| renders sort select with options | Select with options |
| shows default sort selected when initial state is default | Default value |
| dispatches setSortOption when option changed | Sort action |

### Search (`src/components/Search/__tests__/Search.test.tsx`) — 4 tests

| Test | Description |
|------|-------------|
| renders search input with placeholder | Input |
| renders Search heading | Heading |
| search input value reflects searchQuery | Value binding |
| dispatches setSearchQuery when typing | Search action |

### Filters (`src/components/Filters/__tests__/Filters.test.tsx`) — 9 tests

| Test | Description |
|------|-------------|
| shows category loader when categories is undefined | Loading state |
| renders category select with options | Category select |
| renders price range select with options | Price select |
| does not show reset button when no filters applied | No reset |
| shows reset button when category is selected | Reset visible |
| updates category when category select changed | Category change |
| updates price range when select changed | Price change |
| clears filters when reset button clicked | Reset action |
| price range select is focusable via Tab | Keyboard focus |

### Controls (`src/components/Controls/__tests__/Controls.test.tsx`) — 4 tests

| Test | Description |
|------|-------------|
| renders Filters section | Filters |
| renders Search and Sort sections | Search and Sort |
| renders search input, filter category select and sort select | All controls |
| shows category loader when categories undefined | Loader |

### ProductsGrid (`src/components/ProductsGrid/__tests__/ProductsGrid.test.tsx`) — 5 tests

| Test | Description |
|------|-------------|
| shows loader when products is undefined | Loading state |
| shows error message when error is provided | Error state |
| shows error over products when both are provided | Error priority |
| shows empty message when products is empty array | Empty state |
| renders products when products array has items | Product grid |

### ConnectedProductsGrid (`src/components/ProductsGrid/__tests__/ConnectedProductsGrid.test.tsx`) — 6 tests

| Test | Description |
|------|-------------|
| opens product modal when Details is clicked | Modal open |
| shows product modal when URL has product param | Modal from URL |
| shows pagination when filtered results exceed 20 | Pagination visible |
| hides pagination when filtered results are 20 or less | Pagination hidden |
| navigates to next page when Next clicked | Page change |
| hides pagination when filter reduces results to 20 or less | Dynamic pagination |

### ProductCard (`src/components/ProductCard/__tests__/ProductCard.test.tsx`) — 10 tests

| Test | Description |
|------|-------------|
| renders title, description, and price | Core content |
| truncates description to 100 characters by default | Truncation |
| does not truncate description under 100 characters | No truncation |
| uses custom maxDescriptionLength when provided | Custom length |
| renders Details button with accessibility attributes | A11y |
| calls onClick when Details button is clicked | Details click |
| sets loading eager when priority is true | Image eager |
| sets loading lazy when priority is false or omitted | Image lazy |
| calls onClick when Enter is pressed on Details button | Keyboard |
| renders AddToCartControls when product is provided | Add to cart |

### ProductDetailsModal (`src/components/ProductDetailsModal/__tests__/ProductDetailsModal.test.tsx`) — 5 tests

| Test | Description |
|------|-------------|
| returns null when product is null | Null product |
| renders product image, name, full description, and price when product provided | Full content |
| displays full description without truncation | No truncation |
| calls onClose when Close button is clicked | Close button |
| renders AddToCartControls when product is provided | Add to cart |

### AddToCartControls (`src/components/AddToCartControls/__tests__/AddToCartControls.test.tsx`) — 4 tests

| Test | Description |
|------|-------------|
| renders quantity input and Add to cart button | Controls |
| dispatches addToCart when button clicked | Add action |
| adds with custom quantity | Custom quantity |
| calls onAddToCart when provided | Callback |

### CartDropdown (`src/components/CartDropdown/__tests__/CartDropdown.test.tsx`) — 5 tests

| Test | Description |
|------|-------------|
| renders trigger | Trigger |
| shows empty message when cart is empty and dropdown is open | Empty state |
| shows cart items when cart has items and dropdown is open | Items list |
| dispatches updateQuantity when quantity changes | Quantity update |
| dispatches removeFromCart when item is deleted | Remove item |

### CartItem (`src/components/CartItem/__tests__/CartItem.test.tsx`) — 5 tests

| Test | Description |
|------|-------------|
| renders item name, price, and quantity | Content |
| calls onQuantityChange when quantity input changes | Quantity change |
| opens confirm dialog when delete button clicked | Delete dialog |
| calls onDelete when Delete confirmed in dialog | Confirm delete |
| closes dialog when Cancel clicked | Cancel dialog |

### Modal (`src/components/Modal/__tests__/Modal.test.tsx`) — 8 tests

| Test | Description |
|------|-------------|
| returns null when isOpen is false | Hidden |
| renders dialog with children when isOpen is true | Visible content |
| renders Close button | Close button |
| calls onClose when Close button is clicked | Close click |
| calls onClose when cancel event fires (e.g. Esc key) | Escape key |
| calls onClose when clicking backdrop | Backdrop click |
| does not call onClose when clicking content area | Content click |
| returns focus to trigger when modal closes | Focus trap |

### ConfirmDialog (`src/components/ConfirmDialog/__tests__/ConfirmDialog.test.tsx`) — 5 tests

| Test | Description |
|------|-------------|
| renders nothing when isOpen is false | Hidden |
| renders message and buttons when open | Content |
| calls onConfirm and onClose when Delete clicked | Confirm |
| calls onClose when Cancel clicked | Cancel |
| uses custom confirm and cancel labels | Custom labels |

### Dropdown (`src/components/Dropdown/__tests__/Dropdown.test.tsx`) — 6 tests

| Test | Description |
|------|-------------|
| renders trigger | Trigger |
| does not show content initially | Hidden by default |
| shows content on mouse enter | Hover to open |
| closes on Escape key | Escape to close |
| closes when focus moves outside the dropdown | Focus blur |
| applies aria-label to trigger when provided | A11y |

### Button (`src/components/Button/__tests__/Button.test.tsx`) — 2 tests

| Test | Description |
|------|-------------|
| renders children and calls onClick when clicked | Click handler |
| is disabled when disabled prop is true | Disabled state |

### Pagination (`src/components/Pagination/__tests__/Pagination.test.tsx`) — 5 tests

| Test | Description |
|------|-------------|
| renders navigation with Previous, Page info, and Next | Navigation |
| disables Previous on first page | First page |
| disables Next on last page | Last page |
| calls onPageChange with previous page when Previous clicked | Previous |
| calls onPageChange with next page when Next clicked | Next |

---

## UI Documentation (Storybook)

Storybook provides component documentation and visual testing. Run with `npm run storybook` (port 6006). The `@storybook/addon-a11y` addon runs accessibility checks during development.

Stories exist for: Button, AddToCartControls, ProductCard, ProductsGrid, Modal, ProductDetailsModal, Sort, Search, Filters, Controls, CartItem, CartDropdown, NavBar, LoginForm, ConfirmDialog, Dropdown, Icons.

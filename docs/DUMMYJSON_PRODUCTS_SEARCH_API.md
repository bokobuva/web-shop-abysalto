# DummyJSON Products Search API

**Endpoint:** `GET https://dummyjson.com/products/search`

## Query Parameters

| Parameter | Type   | Required | Description                    |
|-----------|--------|----------|--------------------------------|
| `q`       | string | Yes      | Search query (e.g. `phone`)   |
| `skip`    | number | No       | Number of items to skip (pagination) |
| `limit`   | number | No       | Max number of items to return (pagination) |

## Response Structure

```json
{
  "products": [...],
  "total": 23,
  "skip": 0,
  "limit": 30
}
```

| Field     | Type   | Description                                                           |
|-----------|--------|-----------------------------------------------------------------------|
| `products`| array  | Array of product objects matching the search query                    |
| `total`   | number | Total number of products matching the search (ignores skip/limit)      |
| `skip`    | number | Number of items skipped (echoes the `skip` param, or 0 if omitted)   |
| `limit`   | number | Max items requested (echoes the `limit` param, or 30 if omitted)      |

## Pagination Support: Yes

The API supports `skip` and `limit` for pagination.

- **`skip`**: Offset from the start (e.g. `skip=5` returns items starting at index 6).
- **`limit`**: Maximum number of items per response (e.g. `limit=10` returns at most 10 products).

**Example paginated request:**
```
GET https://dummyjson.com/products/search?q=phone&skip=5&limit=3
```

Returns 3 products (items 6–8) with `total: 23`, `skip: 5`, `limit: 3`.

## Product Object Structure

Each item in `products` contains:

| Field                 | Type   |
|-----------------------|--------|
| `id`                  | number |
| `title`               | string |
| `description`         | string |
| `category`            | string |
| `price`               | number |
| `discountPercentage`  | number |
| `rating`              | number |
| `stock`               | number |
| `tags`                | string[] |
| `brand`               | string |
| `sku`                 | string |
| `weight`              | number |
| `dimensions`          | object (`width`, `height`, `depth`) |
| `warrantyInformation` | string |
| `shippingInformation` | string |
| `availabilityStatus`  | string |
| `reviews`             | array  |
| `returnPolicy`        | string |
| `minimumOrderQuantity`| number |
| `meta`                | object |
| `images`              | string[] |
| `thumbnail`           | string |

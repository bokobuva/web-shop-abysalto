This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Security

This application implements authentication and token management with the following security measures to protect user data and ensure secure data transfer and storage.

### Token Storage

Access and refresh tokens are stored in **sessionStorage** rather than localStorage or cookies.

**Why sessionStorage instead of httpOnly cookies?** This app calls DummyJSON directly from the browser. When a third-party API sets cookies, they are set on that API's domain (dummyjson.com), not on our origin (e.g. localhost:3000). We cannot obtain httpOnly cookies for our own domain from a cross-origin request. True httpOnly cookies would require our own backend to proxy the auth flow, receive tokens from DummyJSON, and set cookies via `Set-Cookie` headers for our domain.

**Why sessionStorage instead of regular (JavaScript-accessible) cookies?** Both sessionStorage and `document.cookie` are readable by any JavaScript on the page, so they share the same XSS exposure. sessionStorage is simpler (no cookie parsing, no domain/path/SameSite configuration) and clears automatically when the tab closes.

**Why sessionStorage instead of localStorage?** sessionStorage is cleared when the browser tab closes, reducing the exposure window of tokens compared to long-lived localStorage.

For production deployments, consider using **httpOnly cookies** via a backend proxy, which prevents JavaScript access and mitigates XSS-based token theft.

### Transport Security

All API requests to authentication and data endpoints use **HTTPS** in production. Auth requests use the default `credentials` mode (omit for cross-origin) for compatibility with DummyJSON's CORS policy (`Access-Control-Allow-Origin: *`). Tokens are obtained from response bodies and passed explicitly in headers/body, not via cookies.

### Token Lifecycle

- **Proactive refresh**: Tokens are refreshed before expiry (e.g., 5 minutes before) using JWT payload decoding to determine expiration. This reduces the risk of session expiration during use and limits the time window during which a stolen token remains valid.
- **No token logging**: Tokens are never logged, printed, or included in error messages or URLs.
- **Authorization header**: Access tokens are passed only in the `Authorization: Bearer` header for authenticated requests, never in query strings or request bodies (except the refresh token in the refresh endpoint body as required by the API).

### Credentials and Input

- **Passwords**: User passwords are never stored on the client. They are sent only at login time over HTTPS and are not retained in memory beyond the request lifecycle.
- **Input handling**: Login form inputs are validated; sensitive data is not persisted in client storage beyond the current session.

### Production Recommendations

- Use a **backend proxy** for auth: Forward auth requests through your own API routes so tokens can be set as httpOnly, Secure, SameSite cookies.
- Enable **Content-Security-Policy (CSP)** and other security headers (X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security) in production.
- Implement **rate limiting** and **CAPTCHA** on login endpoints to mitigate brute-force attacks.

# Next TS Route

`next-ts-route` provides high-level utilities for defining type-safe Next.js routes.

## Usage

Create a `./utils/route.ts` file with the following code:

```ts
// File: ./utils/route.ts
const { defineRoute, defineGetServerSideProps } = createRouteBuilder({
  beforeRouteHandler({ req, res }) {
    // Code to run before your per-route handler code (e.g. authentication code, adding properties to the `req` object)
  },
  beforeGetServerSideProps({ req, res }) {
    // Code to run before your `getServerSideProps` handler code
  }
})
```

Then, in your route files ()
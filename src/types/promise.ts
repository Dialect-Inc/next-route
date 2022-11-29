/**
	We use this type instead of `import('type-fest').Promisable` to avoid the error: "The inferred type of 'defineRoute' cannot be named without a reference to '.pnpm/type-fest@3.3.0/node_modules/type-fest'. This is likely not portable. A type annotation is necessary."
*/
export type Promisable<T> = T | Promise<T>
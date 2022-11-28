import invariant from 'tiny-invariant'

import type { ServerContext } from '~/types/context.js'
import type { Route } from '~/types/route.js'

export function getSearchParams<R extends Route>(
	context: ServerContext<R>
): R extends Route<infer Args> ? Args['searchParams'] : never {
	invariant(context.req.url, 'request should have a url')
	const url = new URL(context.req.url, 'https://dialect.so')
	// @ts-expect-error: TypeScript limitation
	return Object.fromEntries(url.searchParams)
}

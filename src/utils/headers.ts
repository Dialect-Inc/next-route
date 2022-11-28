import type { RouteContext } from '~/types/context.js'
import type { Route } from '~/types/route.js'

export function getHeaders<R extends Route>(
	context: RouteContext<R>
): R extends Route<infer Args> ? Args['headers'] : never {
	// @ts-expect-error: correct type
	return context.req.headers
}

import type { IsEqual } from 'type-fest'

import type { ServerContext } from '~/types/context.js'
import type { Route, RouteData } from '~/types/route.js'

export function getPathParams<R extends Route>(
	context: ServerContext<R>
): R extends Route<infer Args>
	? IsEqual<Args, RouteData> extends true
		? Record<string, string>
		: Args['pathParams']
	: never {
	if ('query' in context) {
		// @ts-expect-error: correct type
		return context.query
	} else {
		// @ts-expect-error: correct type
		return context.req.query
	}
}

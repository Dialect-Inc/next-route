/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import ky from 'ky'
import * as superjson from 'superjson'

import type { RequestArgs } from '~/types/request.js'
import type { Route, RouteResponse } from '~/types/route.js'

export async function sendRequest<R extends Route>(
	route: R,
	...args: RequestArgs<R>
): Promise<RouteResponse<R>> {
	const arg = args[0]

	let { path } = route
	path = path.startsWith('/') ? path.slice(1) : path

	const response = await ky(path, {
		method: route.method,
		json: arg?.json,
		searchParams: arg?.searchParams as Record<
			string,
			string | number | boolean
		>,
		headers: (arg?.headers as Record<string, string | undefined>) ?? {},
		throwHttpErrors: false,
	})

	const responseText = await response.text()
	const result = superjson.parse(responseText)

	return result as RouteResponse<R>
}

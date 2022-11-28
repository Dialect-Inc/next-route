import { useRouter } from 'next/router.js'
import { useCallback, useEffect, useState } from 'react'

import type { RequestArgs } from '~/types/request.js'
import type {
	JsonifiedRouteResponseData,
	Route,
	RouteResponse,
} from '~/types/route.js'
import { sendRequest } from '~/utils/request.js'

export function useRoute<R extends Route>(
	route: R
): {
	(...args: RequestArgs<R>): Promise<JsonifiedRouteResponseData<R>>
	isLoading: boolean
	response: RouteResponse<R> | null
} {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [response, setResponse] = useState<RouteResponse<R> | null>(null)

	let { path } = route
	if (path.startsWith('/')) {
		path = path.slice(1)
	}

	const processRequest = useCallback(
		async (args: any = {}): Promise<any> => {
			try {
				setIsLoading(true)
				const result = await sendRequest<R>(
					route,
					// @ts-expect-error: `args` is the correct type but TypeScript can't detect that
					args
				)

				if (result.extensions?.redirectUrl === undefined) {
					setResponse(result)

					if (result.data === null) {
						// eslint-disable-next-line @typescript-eslint/no-throw-literal
						throw result
					}
				} else {
					await router.push(result.extensions.redirectUrl)
				}

				return result
			} finally {
				setIsLoading(false)
			}
		},
		[route, router]
	)

	;(processRequest as any).isLoading = isLoading
	;(processRequest as any).response = response

	// @ts-expect-error: TypeScript doesn't know that we set the `isLoading` and `response` properties
	return processRequest
}

export function useRouteData<R extends Route>(
	route: R,
	...args: RequestArgs<R>
) {
	const callRoute = useRoute(route)
	const [routeData, setRouteData] = useState<RouteResponse<R> | null>(null)

	useEffect(() => {
		void (async () => {
			// @ts-expect-error: Route data assumes that the route doesn't need info
			setRouteData(await callRoute(args))
		})()
	}, [])

	return routeData
}

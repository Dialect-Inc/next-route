import type {
	GetServerSideProps,
	GetServerSidePropsContext,
	GetServerSidePropsResult,
	NextApiRequest,
	NextApiResponse,
} from 'next'
import * as superjson from 'superjson'
import invariant from 'tiny-invariant'
import { z } from 'zod'

import type { RouteContext } from '~/types/context.js'
import type { GetRoute, GetRouteArgs } from '~/types/get.js'
import type { PostRoute, PostRouteArgs } from '~/types/post.js'
import { Promisable } from '~/types/promise.js'
import type { Route, RouteResponse, RouteResponseFromData } from '~/types/route.js'
import { isRedirectError } from '~/utils/redirect.js'
import { reply } from '~/utils/reply.js'

export function createRouteBuilder(routeBuilderOptions?: {
	beforeRouteHandler?(args: {
		req: NextApiRequest
		res: NextApiResponse
		options: any
	}): Promisable<void>
	beforeGetServerSideProps?(
		context: GetServerSidePropsContext
	): Promisable<void>,
	onRouteError?(error: unknown): Promisable<void | RouteResponse<Route>>,
	onServerSidePropsError?(error: unknown): Promisable<GetServerSidePropsResult<any>>
}) {
	function defineRoute<Path extends string, Args extends GetRouteArgs<Path>>(
		args: Args
	): {
		handler: <ResData>(
			handlerFunction: (
				context: RouteContext<GetRoute<Args, ResData>>
			) => Promisable<RouteResponse<GetRoute<Args, ResData>>>
		) => GetRoute<Args, ResData>
	}
	function defineRoute<Path extends string, Args extends PostRouteArgs<Path>>(
		args: Args
	): {
		handler: <ResData>(
			handlerFunction: (
				context: RouteContext<PostRoute<Args, ResData>>
			) => Promisable<RouteResponse<PostRoute<Args, ResData>>>
		) => PostRoute<Args, ResData>
	}
	function defineRoute<Args extends GetRouteArgs | PostRouteArgs>(
		args: Args
	): any {
		async function handleRequest(
			handlerFunction: (...args: any) => any,
			req: NextApiRequest,
			res: NextApiResponse,
			options: { adminOnly?: boolean }
		) {
			try {
				await routeBuilderOptions?.beforeRouteHandler?.({ req, res, options })

				if (args.searchParams !== undefined) {
					invariant(req.url, 'request should have a url')
					const url = new URL(req.url, 'https://dialect.so')
					await z
						.object(args.searchParams({ req, res }))
						.parseAsync(Object.fromEntries(url.searchParams))
				}

				if (args.method === 'post' && args.body !== undefined) {
					await z.object(args.body({ req, res })).parseAsync(req.body)
				}

				if (args.headers !== undefined) {
					await z.object(args.headers({ req, res })).parseAsync(req.headers)
				}

				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const response = await handlerFunction({ req, res })

				reply(res, response)
				return
			} catch (error: unknown) {
				if (routeBuilderOptions?.onRouteError !== undefined) {
					const response = await routeBuilderOptions?.onRouteError?.(error)
					if (response !== undefined) {
						reply(res, response)
						return
					}
				}

				if (isRedirectError(error)) {
					const location = (error as any).extensions.redirectUrl as string
					invariant(location, '`location` should not be undefined')
					const response = {
						data: null,
						extensions: {
							redirectUrl: location,
						},
					}

					reply(res, response)
					return
				}

				const response = {
					data: null,
					errors: [{ message: (error as any).message as string }],
				}
				reply(res, response)
			}
		}

		const createHandler = (handlerFunction: any) => {
			async function handler(req: NextApiRequest, res: NextApiResponse) {
				return handleRequest(handlerFunction, req, res, {
					adminOnly: args.adminOnly,
				})
			}

			Object.assign(handler, {
				method: args.method,
				path: args.path,
				pathParams: args.pathParams,
			})

			return handler
		}

		if (process.env.APP_ENV === 'production') {
			return { handler: createHandler }
		} else {
			return Object.assign(
				function missingHandler() {
					if (process.env.APP_ENV !== 'production') {
						throw new Error(
							`Route handler was not set; make sure you call \`.handler()\` after calling \`defineRoute()\``
						)
					}
				},
				{ handler: createHandler }
			)
		}
	}

	function defineGetServerSideProps<R extends RouteResponseFromData<any>>(
		handler: (context: GetServerSidePropsContext) => R | Promise<R>
	): GetServerSideProps<R> {
		const getServerSideProps: GetServerSideProps = async (context) => {
			try {
				await routeBuilderOptions?.beforeGetServerSideProps?.(context)

				const serverData = await handler(context)

				return {
					props: {
						serverData: superjson.stringify(serverData),
					},
				}
			} catch (error: unknown) {
				if (routeBuilderOptions?.onServerSidePropsError !== undefined) {
					const response = await routeBuilderOptions?.onServerSidePropsError?.(error)
					if (response !== undefined) {
						return response
					}
				}

				if (isRedirectError(error)) {
					const location = (error as any).extensions.redirectUrl as string
					invariant(location, '`location` should not be undefined')
					return {
						redirect: {
							destination: location,
							permanent: false
						}
					}
				}

				throw error
			}
		}

		// @ts-expect-error: correct type
		return getServerSideProps
	}

	return {
		defineRoute,
		defineGetServerSideProps,
	}
}

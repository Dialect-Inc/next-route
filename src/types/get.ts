import type { NextApiRequest, NextApiResponse } from 'next'
import type { ZodType } from 'zod'

import type { Route } from '~/types/route.js'
import type { ZodObjectSchemaToType } from '~/types/zod.js'

export interface GetRouteArgs<Path extends string = string> {
	method: 'get'
	adminOnly?: boolean
	searchParams?: (context: {
		req: NextApiRequest
		res: NextApiResponse
		// TODO: This should be ZodString | ZodOptional<ZodString> but it doesn't make refiners happy
	}) => Record<string, ZodType>
	headers?: (context: {
		req: NextApiRequest
		res: NextApiResponse
	}) => Record<string, ZodType>
	pathParams?: Record<string, true>
	path: Path
}

export type GetRoute<Args extends GetRouteArgs, ResData> = Route<{
	method: 'get'
	headers: Args['headers'] extends (...args: any) => unknown
		? ZodObjectSchemaToType<ReturnType<Args['headers']>>
		: undefined
	searchParams: Args['searchParams'] extends (...args: any) => unknown
		? ZodObjectSchemaToType<ReturnType<Args['searchParams']>>
		: undefined
	response: ResData
	pathParams: Args['pathParams'] extends Record<string, string>
		? Args['pathParams']
		: undefined
	path: Args['path']
	body: undefined
}>

export type GetMethodRequest<Args extends GetRouteArgs> = Omit<
	NextApiRequest,
	'headers' | 'query' | 'params'
> & {
	headers: Args['headers'] extends Record<string, ZodType>
		? ZodObjectSchemaToType<Args['headers']>
		: NextApiRequest['headers']
}

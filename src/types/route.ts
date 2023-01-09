export interface RouteData {
	method: 'get' | 'post'
	response: any
	body: Record<string, unknown> | undefined
	headers: Record<string, unknown> | undefined
	searchParams: Record<string, unknown> | undefined
	pathParams: Record<string, string> | undefined
	path: string
}

export interface Route<Data extends RouteData = RouteData> {
	method: Data['method']
	path: Data['path']
	pathParams: Data['pathParams']
	body: Data['body']
	headers: Data['headers']
	searchParams: Data['searchParams']
}

/**
	Based on the GraphQL specification for errors
	@see https://spec.graphql.org/draft/#sec-Errors
*/
export type RouteResponse<R extends Route> = (
	| {
			data: null
			errors: Array<{
				message: string
				extensions?: { key?: string; payload?: Record<string, unknown> }
			}>
	  }
	| {
			data: R extends Route<infer Data> ? Data['response'] : never
			errors?: Array<{
				message: string
				extensions?: { code?: string; payload?: Record<string, unknown> }
			}>
	  }
) & {
	extensions?: {
		redirectUrl?: string
		statusCode?: number
		successMessage?: string
		headers?: Record<string, string>
		interstitial?: string
	}
}

export interface RouteResponseFromData<D> {
	data: D
	errors?: Array<{
		message: string
		extensions?: { code?: string; payload?: Record<string, unknown> }
	}>
	extensions?: {
		redirectUrl?: string
		statusCode?: number
		successMessage?: string
		headers?: Record<string, string>
		interstitial?: string
	}
}

export type JsonifiedRouteResponseData<R extends Route> = Omit<
	RouteResponse<R>,
	'data'
> & {
	data: R extends Route<infer Data> ? Data['response'] : never
}

import type { EmptyObject } from 'type-fest'

import type { Route } from '~/types/route.js'

export type RequestArgs<R extends Route> = R extends Route<infer Data>
	? [
			Data['body'],
			Data['headers'],
			Data['searchParams'],
			Data['pathParams']
	  ] extends [undefined, undefined, undefined, undefined]
		? // eslint-disable-next-line @typescript-eslint/ban-types
		  []
		: [
				args: (Data['body'] extends undefined
					? EmptyObject
					: { json: Data['body'] }) &
					(Data['searchParams'] extends undefined
						? EmptyObject
						: { searchParams: Data['searchParams'] }) &
					(Data['headers'] extends undefined
						? EmptyObject
						: { headers: Data['headers'] }) &
					(Data['pathParams'] extends undefined
						? EmptyObject
						: {
								pathParams: {
									[PathParam in keyof Data['pathParams']]: string
								}
						  })
		  ]
	: never

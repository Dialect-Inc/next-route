import type { NextApiResponse } from 'next'
import * as superjson from 'superjson'

import type { Route, RouteResponse } from '~/types/route.js'

export function reply<R extends Route>(
	res: NextApiResponse,
	schema: RouteResponse<R>
) {
	if (schema.extensions?.statusCode !== undefined) {
		res.status(schema.extensions.statusCode).send(superjson.stringify(schema))
	} else if (schema.errors !== undefined && schema.errors.length > 0) {
		res.status(500).send(superjson.stringify(schema))
	} else {
		res.status(200).send(superjson.stringify(schema))
	}
}

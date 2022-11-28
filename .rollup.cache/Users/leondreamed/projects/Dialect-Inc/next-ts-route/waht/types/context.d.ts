/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import type { EmptyObject } from 'type-fest';
import type { ZodOptional, ZodString } from 'zod';
import type { GetMethodRequest, GetRouteArgs } from '~/types/get.js';
import type { PostMethodRequest, PostRouteArgs } from '~/types/post.js';
import type { Route } from '~/types/route.js';
import type { ZodObjectSchemaToType } from '~/types/zod.js';
export interface HandlerFunctionContext {
    req: IncomingMessage;
    res: ServerResponse;
}
export interface RouteContext<_R extends Route = Route> {
    req: Omit<NextApiRequest, 'body'> & {
        body: unknown;
    };
    res: NextApiResponse;
}
export type ServerContext<R extends Route> = RouteContext<R> | GetServerSidePropsContext;
export interface GetHandlerFunctionContext<Args extends GetRouteArgs> {
    req: GetMethodRequest<Args>;
    res: ServerResponse;
    pathParams: Args['pathParams'] extends Record<string, true> ? Record<keyof Args['pathParams'], string> : EmptyObject;
    searchParams: Args['searchParams'] extends Record<string, ZodString | ZodOptional<ZodString>> ? ZodObjectSchemaToType<Args['searchParams']> : Record<string, string>;
}
export interface PostHandlerFunctionContext<Args extends PostRouteArgs> {
    req: PostMethodRequest<Args>;
    res: ServerResponse;
    pathParams: Args['pathParams'] extends Record<string, true> ? Record<keyof Args['pathParams'], string> : EmptyObject;
    searchParams: Args['searchParams'] extends Record<string, ZodString | ZodOptional<ZodString>> ? ZodObjectSchemaToType<Args['searchParams']> : Record<string, string>;
}

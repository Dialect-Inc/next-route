export const redirect = (route: string) => ({
	extensions: { redirectUrl: route },
})

export function isRedirectError(error: any) {
	return error.extensions?.redirectUrl !== undefined
}

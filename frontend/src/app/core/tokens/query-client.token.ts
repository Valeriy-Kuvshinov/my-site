import { InjectionToken } from "@angular/core"
import { QueryClient } from "@tanstack/angular-query-experimental"

const CACHE_TIMEOUT_MILLIS = 1000 * 60 * 15
const STALE_TIMEOUT_MILLS = 1000 * 60

export const QUERY_CLIENT_TOKEN = new InjectionToken<QueryClient>("QueryClient", {
	providedIn: "root",
	factory: () =>
		new QueryClient({
			defaultOptions: {
				queries: {
					staleTime: STALE_TIMEOUT_MILLS,
					gcTime: CACHE_TIMEOUT_MILLIS,
					retry: 5,
					refetchOnWindowFocus: false,
				},
			},
		}),
})

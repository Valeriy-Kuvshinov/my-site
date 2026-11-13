import { InjectionToken } from "@angular/core"
import { QueryClient } from "@tanstack/angular-query-experimental"

const CACHE_TIMEOUT_MILLIS = 1000 * 60 * 15
const STALE_TIMEOUT_MILLS = 1000 * 60
const MAX_RETRIES = 5

export const QUERY_CLIENT_TOKEN = new InjectionToken<QueryClient>("QueryClient", {
	providedIn: "root",
	factory: () =>
		new QueryClient({
			defaultOptions: {
				queries: {
					staleTime: STALE_TIMEOUT_MILLS,
					gcTime: CACHE_TIMEOUT_MILLIS,
					retry: (failureCount, error) => {
						if (
							error.message.includes("Unauthorized") ||
							error.message.includes("401")
						) {
							return false
						}
						return failureCount < MAX_RETRIES
					},
					refetchOnWindowFocus: false,
				},
			},
		}),
})

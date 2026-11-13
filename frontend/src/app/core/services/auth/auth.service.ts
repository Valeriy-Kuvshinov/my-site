import { Injectable, computed, inject } from "@angular/core"
import { QueryClient, injectMutation, injectQuery } from "@tanstack/angular-query-experimental"

import { AuthUser, LoginCredentials } from "@/shared/interfaces/user"

import { SystemStore } from "@/core/stores/system.store"

import { QUERY_CLIENT_TOKEN } from "@/core/tokens/query-client.token"

import { HttpService } from "../api/http.service"

const AUTH_ENDPOINT = "auth"
const STALE_TIMEOUT_MILLS = 1000 * 60 * 15

export const authKeys = {
	all: ["auth"] as const,
	me: () => [...authKeys.all, "me"] as const,
}

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private readonly http = inject(HttpService)
	private readonly store = inject(SystemStore)
	private readonly queryClient = inject<QueryClient>(QUERY_CLIENT_TOKEN)

	private readonly sessionQuery = injectQuery(() => ({
		queryKey: authKeys.me(),
		queryFn: async (): Promise<AuthUser | null> => {
			try {
				const response = await this.http.get<AuthUser>(`${AUTH_ENDPOINT}/me`)
				return response.data || null
			} catch (err) {
				return null
			}
		},
		staleTime: STALE_TIMEOUT_MILLS,
		retry: false,
	}))

	readonly currentUser = computed(() => this.sessionQuery.data() ?? null)

	readonly isAuthInitializing = computed(() => this.sessionQuery.isPending())

	login() {
		return injectMutation(() => ({
			mutationFn: async (credentials: LoginCredentials): Promise<AuthUser> => {
				const response = await this.http.post<AuthUser>(
					`${AUTH_ENDPOINT}/login`,
					credentials
				)

				if (!response.data) throw new Error("No user data received")

				return response.data
			},
			onSuccess: (loggedInUser) => {
				this.queryClient.setQueryData(authKeys.me(), loggedInUser)

				this.store.showSuccess("Login Successful", "Welcome back.")
				this.store.setA11yAnnouncement("Login successful.", "polite")
			},
			onError: (error: Error) => {
				this.store.showError("Login Failed", error.message)
				this.store.setA11yAnnouncement(`Login failed: ${error.message}`, "assertive")
			},
		}))
	}

	logout() {
		return injectMutation(() => ({
			mutationFn: async (): Promise<void> => {
				await this.http.post<void>(`${AUTH_ENDPOINT}/logout`)
			},
			onSuccess: () => {
				this.queryClient.setQueryData(authKeys.me(), null)
				this.queryClient.removeQueries({ queryKey: authKeys.all })

				this.store.showSuccess("Logged Out", "Session ended securely.")
				this.store.setA11yAnnouncement("Logged out.", "polite")
			},
			onError: (error: Error) => {
				this.store.showError("Logout Failed", error.message)
				this.store.setA11yAnnouncement(`Logout Failed: ${error.message}`, "assertive")
			},
		}))
	}
}

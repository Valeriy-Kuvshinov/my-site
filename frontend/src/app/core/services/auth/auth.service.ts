import { Injectable, inject, signal } from "@angular/core"

import { AuthUser, LoginCredentials } from "@/shared/interfaces/user"

import { SystemStore } from "@/core/stores/system.store"

import { HttpService } from "../api/http.service"

const AUTH_ENDPOINT = "auth"

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private readonly http = inject(HttpService)
	private readonly store = inject(SystemStore)

	private readonly _currentUser = signal<AuthUser | null>(null)
	private readonly _isInitializing = signal<boolean>(true)
	private readonly _isLoggingIn = signal<boolean>(false)
	private readonly _isLoggingOut = signal<boolean>(false)

	readonly currentUser = this._currentUser.asReadonly()
	readonly isAuthInitializing = this._isInitializing.asReadonly()
	readonly isLoggingIn = this._isLoggingIn.asReadonly()
	readonly isLoggingOut = this._isLoggingOut.asReadonly()

	constructor() {
		this.restoreSession()
	}

	private async restoreSession(): Promise<void> {
		try {
			const response = await this.http.get<AuthUser>(`${AUTH_ENDPOINT}/me`)
			this._currentUser.set(response.data || null)
		} catch {
			this._currentUser.set(null)
		} finally {
			this._isInitializing.set(false)
		}
	}

	async login(credentials: LoginCredentials): Promise<void> {
		this._isLoggingIn.set(true)
		try {
			const response = await this.http.post<AuthUser>(`${AUTH_ENDPOINT}/login`, credentials)

			if (!response.data) throw new Error("No user data received")

			this._currentUser.set(response.data)

			this.store.showSuccess("Login Successful", "Welcome back!")
			this.store.setA11yAnnouncement("Login successful.", "polite")
		} catch (error: any) {
			this.store.showError("Login Failed", error.message)
			this.store.setA11yAnnouncement(`Login failed: ${error.message}`, "assertive")

			throw error
		} finally {
			this._isLoggingIn.set(false)
		}
	}

	async logout(): Promise<void> {
		this._isLoggingOut.set(true)
		try {
			await this.http.post<void>(`${AUTH_ENDPOINT}/logout`)

			this._currentUser.set(null)

			this.store.showSuccess("Logged Out", "See you later!")
			this.store.setA11yAnnouncement("Logged out.", "polite")
		} catch (error: any) {
			this.store.showError("Logout Failed", error.message)
			this.store.setA11yAnnouncement(`Logout Failed: ${error.message}`, "assertive")
		} finally {
			this._isLoggingOut.set(false)
		}
	}
}

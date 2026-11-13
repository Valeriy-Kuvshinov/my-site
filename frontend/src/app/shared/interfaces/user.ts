export interface LoginCredentials {
	email: string
	password: string
	turnstileToken: string
}

export interface AuthUser {
	id: string
	email?: string
	role?: string
}

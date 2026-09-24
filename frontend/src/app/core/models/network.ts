export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

export interface QueryParams {
	[key: string]: string | number | boolean
}

export interface HttpHeaders {
	"Content-Type": string
	"Cache-Control": string
	Pragma: string
	Expires: string
	[key: string]: string
}

export interface HttpConfig extends RequestInit {
	method: HttpMethod
	headers: HttpHeaders
	body?: string
	credentials?: RequestCredentials
}

export interface ApiResponse<T> {
	message?: string
	error?: string
	data?: T
}

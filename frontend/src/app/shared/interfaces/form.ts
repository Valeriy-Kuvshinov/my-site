export interface ContactFormData {
	name: string
	email: string
	title: string
	requestType: string
	message: string
	consent: boolean
	turnstileToken?: string | null
}

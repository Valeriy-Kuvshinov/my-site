export interface ContactMailForm {
	name: string
	email: string
	title: string
	requestType: string
	message: string
	consent: boolean
	turnstileToken?: string
}

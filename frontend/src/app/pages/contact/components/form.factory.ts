import { FormBuilder, Validators } from "@angular/forms"

export function buildContactForm(fb: FormBuilder) {
	return fb.nonNullable.group({
		name: [
			"",
			[
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(32),
				Validators.pattern(/^[a-zA-Z\s'.-]+$/),
			],
		],
		email: [
			"",
			[
				Validators.required,
				Validators.email,
				Validators.minLength(5),
				Validators.maxLength(64),
			],
		],
		title: [
			"",
			[
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(64),
				Validators.pattern(/^[a-zA-Z0-9\s.\-!?']+$/),
			],
		],
		requestType: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(32)]],
		message: [
			"",
			[
				Validators.required,
				Validators.minLength(15),
				Validators.maxLength(600),
				Validators.pattern(/^[a-zA-Z0-9\s.\-!?@#$',*;:]+$/),
			],
		],
		consent: [false, Validators.requiredTrue],
	})
}

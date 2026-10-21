import { Component, inject, ViewChild, signal, OnInit, Input, computed } from "@angular/core"
import { FormBuilder, Validators, ReactiveFormsModule, FormControl } from "@angular/forms"
import { NgxTurnstileModule, NgxTurnstileComponent } from "ngx-turnstile"
import { RouterLink } from "@angular/router"

import { environment } from "../../../../environments/environment.development"

import { ContactMailForm } from "../../../shared/interfaces/form"
import { IconName } from "../../../shared/components/icon/icon.map"

import { MailService } from "../../../core/services/api/mail/mail.service"

import { InputAreaComponent } from "../../../shared/components/form/input-area/input-area.component"
import { SelectAreaComponent } from "../../../shared/components/form/select-area/select-area.component"
import { SvgIconComponent } from "../../../shared/components/icon/icon.component"
import { LoadingComponent } from "../../../shared/components/loading/loading.component"

interface FormValues {
	name: string
	email: string
	title: string
	requestType: string
	consent: boolean
	message: string
}

@Component({
	selector: "form[app-contact-form]",
	standalone: true,
	imports: [
		RouterLink,
		ReactiveFormsModule,
		NgxTurnstileModule,
		InputAreaComponent,
		SelectAreaComponent,
		SvgIconComponent,
		LoadingComponent,
	],
	templateUrl: "./form.html",
	styleUrl: "./form.css",
	host: {
		class: "grid layout-row w-full gap-4",
		"(submit)": "onSubmit($event)",
	},
})
export class ContactFormComponent implements OnInit {
	private readonly fb = inject(FormBuilder)
	private readonly mailService = inject(MailService)

	@Input({ required: true }) initialValues!: FormValues

	@ViewChild(NgxTurnstileComponent) turnstileRef!: NgxTurnstileComponent

	readonly sendMailMutation = this.mailService.sendContactMail()

	protected readonly TURNSTILE_KEY = environment.turnstilePublicKey

	readonly isActiveInteract = signal(false)
	readonly isProcessing = signal(false)
	readonly turnstileToken = signal<string | null>(null)

	readonly isFormBusy = computed(() => this.isProcessing() || this.sendMailMutation.isPending())

	readonly form = this.fb.nonNullable.group({
		name: [
			"",
			[
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(30),
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
				Validators.maxLength(50),
				Validators.pattern(/^[a-zA-Z0-9\s.\-!?']+$/),
			],
		],
		requestType: ["", Validators.required],
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

	ngOnInit() {
		this.form.patchValue(this.initialValues)
	}

	getInputControl(name: keyof typeof this.form.controls): FormControl {
		return this.form.get(name) as FormControl
	}

	getErrorMessage(controlName: keyof typeof this.form.controls): string | null {
		const control = this.form.get(controlName)

		if (!control || !control.touched || !control.errors) return null

		if (control.errors["required"] || control.errors["requiredTrue"]) return "Required field"
		if (control.errors["minlength"]) return "Too short"
		if (control.errors["maxlength"]) return "Too long"
		if (control.errors["email"]) return "Invalid format"
		if (control.errors["pattern"]) return "Invalid characters"

		return "Invalid input"
	}

	get isSendDisabled(): boolean {
		return this.form.invalid || this.isFormBusy() || !this.turnstileToken
	}

	get buttonIcon(): IconName {
		return this.isActiveInteract() && !this.isSendDisabled ? "run" : "stand"
	}

	onTurnstileResolved(token: string | null) {
		this.turnstileToken.set(token)
	}

	// error or expire
	onTurnstileInvalid() {
		this.turnstileToken.set(null)
	}

	async onSubmit(event?: Event) {
		event?.preventDefault()

		if (this.isSendDisabled) {
			this.form.markAllAsTouched()
			return
		}
		this.isProcessing.set(true)

		if (!this.turnstileToken()) {
			this.isProcessing.set(false)
			return
		}
		const formData: ContactMailForm = {
			...this.form.getRawValue(),
			turnstileToken: this.turnstileToken()!,
		}
		try {
			await this.sendMailMutation.mutateAsync(formData)
			this.form.reset(this.initialValues)
		} catch (err) {
			console.error("Failed process in ContactForm:", err)
		} finally {
			this.isProcessing.set(false)
			this.turnstileToken.set(null)
			this.turnstileRef.reset()
		}
	}
}

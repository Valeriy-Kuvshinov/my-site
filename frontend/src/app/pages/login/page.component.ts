import { Component, computed, inject, signal, ViewChild } from "@angular/core"
import { FormControl, Validators, FormBuilder, ReactiveFormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { NgxTurnstileComponent } from "ngx-turnstile"

import { LoginCredentials } from "@/shared/interfaces/user"

import { environment } from "@environments/environment"

import { AuthService } from "@/core/services/auth/auth.service"

import { InputAreaComponent } from "@/shared/components/form/input-area/input-area.component"
import { LoadingComponent } from "@/shared/components/loading/loading.component"

@Component({
	selector: "main[app-login-page]",
	standalone: true,
	imports: [
		ReactiveFormsModule,
		InputAreaComponent,
		NgxTurnstileComponent,
		LoadingComponent,
	],
	templateUrl: "./page.html",
	styleUrl: "./page.css",
	host: {
		id: "main-content",
		class: "w-h-full block",
	},
})
export default class PageComponent {
	private readonly authService = inject(AuthService)

	private readonly router = inject(Router)

	private readonly fb = inject(FormBuilder)

	@ViewChild(NgxTurnstileComponent) turnstileRef!: NgxTurnstileComponent

	protected readonly TURNSTILE_KEY = environment.turnstilePublicKey

	protected readonly loginMutation = this.authService.login()

	readonly isProcessing = signal(false)
	readonly turnstileToken = signal<string | null>(null)

	readonly isFormBusy = computed(() => this.isProcessing() || this.loginMutation.isPending())

	protected readonly form = this.fb.nonNullable.group({
		email: ["", [Validators.required, Validators.email]],
		password: ["", [Validators.required, Validators.minLength(6)]],
	})

	getInputControl(name: keyof typeof this.form.controls): FormControl {
		return this.form.get(name) as FormControl
	}

	getErrorMessage(controlName: keyof typeof this.form.controls): string | null {
		const control = this.form.get(controlName)

		if (!control || !control.touched || !control.errors) return null

		if (control.errors["required"]) return "Required field"

		if (control.errors["email"]) return "Invalid format"

		if (control.errors["minlength"]) return "Too short"

		return "Invalid input"
	}

	get isSendDisabled(): boolean {
		return this.form.invalid || this.isFormBusy() || !this.turnstileToken()
	}

	onTurnstileResolved(token: string | null) {
		this.turnstileToken.set(token)
	}

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

		const formData: LoginCredentials = {
			...this.form.getRawValue(),
			turnstileToken: this.turnstileToken()!,
		}

		try {
			await this.loginMutation.mutateAsync(formData)

			this.form.reset()
			this.router.navigate(["/admin"])
		} catch (err) {
			console.error("Login submission failed", err)
		} finally {
			this.isProcessing.set(false)
			this.turnstileToken.set(null)
			this.turnstileRef?.reset()
		}
	}
}

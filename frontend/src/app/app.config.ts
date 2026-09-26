import {
	ApplicationConfig,
	inject,
	provideAppInitializer,
	provideBrowserGlobalErrorListeners,
} from "@angular/core"
import { provideRouter } from "@angular/router"
import { provideClientHydration } from "@angular/platform-browser"
import { provideHttpClient, withInterceptors } from "@angular/common/http"
import { provideTanStackQuery } from "@tanstack/angular-query-experimental"
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // <-- ADD THIS

import { QUERY_CLIENT_TOKEN } from "./core/tokens/query-client.token"

import { apiInterceptor } from "./core/interceptor/api.interceptor"

import { A11yService } from "./core/services/a11y.service"

import { routes } from "./app.routes"

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),

		provideRouter(routes),

		provideClientHydration(),

		provideAnimationsAsync(),

		provideHttpClient(withInterceptors([apiInterceptor])),

		provideTanStackQuery(QUERY_CLIENT_TOKEN),

		provideAppInitializer(() => {
			inject(A11yService)
		}),
	],
}

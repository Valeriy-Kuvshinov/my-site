import {
	ApplicationConfig,
	ErrorHandler,
	inject,
	provideAppInitializer,
	provideBrowserGlobalErrorListeners,
} from "@angular/core"
import { provideRouter, UrlSerializer, withInMemoryScrolling } from "@angular/router"
import { provideClientHydration } from "@angular/platform-browser"
import { provideHttpClient, withInterceptors } from "@angular/common/http"
import { provideTanStackQuery } from "@tanstack/angular-query-experimental"

import { QUERY_CLIENT_TOKEN } from "./core/tokens/query-client.token"

import { httpInterceptor } from "./core/interceptor/http.interceptor"

import { TrailingSlashSerializer } from "./core/providers/trailing-slash-serializer"
import { GlobalErrorHandler } from "./core/errors/global-error-handler"

import { A11yService } from "./core/services/a11y.service"

import { routes } from "./app.routes"

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),

		{ provide: UrlSerializer, useClass: TrailingSlashSerializer },

		{ provide: ErrorHandler, useClass: GlobalErrorHandler },

		provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: "enabled" })),

		provideClientHydration(),

		provideHttpClient(withInterceptors([httpInterceptor])),

		provideTanStackQuery(QUERY_CLIENT_TOKEN),

		provideAppInitializer(() => {
			inject(A11yService)
		}),
	],
}

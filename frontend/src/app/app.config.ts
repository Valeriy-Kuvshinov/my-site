import { ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core"
import { provideRouter } from "@angular/router"
import { provideClientHydration } from "@angular/platform-browser"
import { provideHttpClient, withInterceptors } from "@angular/common/http"

import { apiInterceptor } from "./core/interceptor/api.interceptor"

import { routes } from "./app.routes"

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(routes),
		provideClientHydration(),
		provideHttpClient(withInterceptors([apiInterceptor])),
	],
}

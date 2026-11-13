import { inject, PLATFORM_ID } from "@angular/core"
import { CanActivateFn, Router } from "@angular/router"
import { toObservable } from "@angular/core/rxjs-interop"
import { filter, map } from "rxjs"

import { AuthService } from "../services/auth/auth.service"
import { isPlatformBrowser } from "@angular/common"

export const adminGuard: CanActivateFn = () => {
	const authService = inject(AuthService)

	const router = inject(Router)

	const platformId = inject(PLATFORM_ID)

	if (!isPlatformBrowser(platformId)) return true

	return toObservable(authService.isAuthInitializing).pipe(
		filter((isInit) => !isInit),
		map(() => {
			if (authService.currentUser()) return true

			return router.parseUrl("/login") // Not authorized
		})
	)
}

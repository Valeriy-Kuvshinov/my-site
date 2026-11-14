import { inject, PLATFORM_ID } from "@angular/core"
import { CanActivateFn, Router } from "@angular/router"
import { toObservable } from "@angular/core/rxjs-interop"
import { isPlatformBrowser } from "@angular/common"
import { filter, map, take } from "rxjs"

import { AuthService } from "../services/auth/auth.service"

export const adminGuard: CanActivateFn = () => {
	const authService = inject(AuthService)

	const router = inject(Router)

	const platformId = inject(PLATFORM_ID)

	if (!isPlatformBrowser(platformId)) return true

	return toObservable(authService.isAuthInitializing).pipe(
		filter((isInit) => !isInit),
		take(1),
		map(() => {
			if (authService.currentUser()) return true

			return router.parseUrl("/login")
		})
	)
}

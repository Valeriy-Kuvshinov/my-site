import { Injectable, ErrorHandler } from "@angular/core"

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
	handleError(error: any): void {
		const errorString = error?.message || error?.toString() || ""

		// Webpack, Esbuild, and Vite dynamic import failures
		const isChunkLoadFailed =
			errorString.includes("Loading chunk") ||
			errorString.includes("Failed to fetch dynamically imported module") ||
			errorString.includes("Importing a module script failed") ||
			errorString.includes("dynamically imported module")

		if (isChunkLoadFailed) {
			console.warn("Stale lazy-chunk detected. Reloading page to fetch latest version...")

			window.location.reload()
			return
		}

		console.error(error) // For all other errors, behave normally
	}
}

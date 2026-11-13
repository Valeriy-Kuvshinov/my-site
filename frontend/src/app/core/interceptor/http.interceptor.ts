import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http"
import { timeout, catchError, throwError } from "rxjs"

interface HttpHeaders {
	"Content-Type": string
	"Cache-Control": string
	Pragma: string
	Expires: string
	[key: string]: string
}

const HTTP_ABORT_TIMEOUT_MILLIS = 1000 * 60 * 3

const BASE_HEADERS: HttpHeaders = {
	"Content-Type": "application/json",
	Accept: "application/json",
	"Cache-Control": "no-cache, no-store, must-revalidate",
	Pragma: "no-cache",
	Expires: "0",
}

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
	const modifiedReq = req.clone({
		withCredentials: true,
		setHeaders: BASE_HEADERS,
	})

	return next(modifiedReq).pipe(
		timeout(HTTP_ABORT_TIMEOUT_MILLIS),
		catchError((error: unknown) => {
			console.error("HTTP Pipeline Error: ", error)

			if (error instanceof HttpErrorResponse) {
				const { error: httpError, message, status } = error

				const backendMessage = httpError || `HTTP ${status}: ${message}`

				return throwError(() => new Error(backendMessage))
			}

			if (error instanceof Error) return throwError(() => error)

			return throwError(
				() => new Error(typeof error === "string" ? error : "An unknown error occurred")
			)
		})
	)
}

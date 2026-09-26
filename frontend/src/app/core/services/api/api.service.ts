import { HttpClient, HttpParams } from "@angular/common/http"
import { inject, Injectable } from "@angular/core"
import { firstValueFrom } from "rxjs"

import { ApiResponse } from "../../models/network"

import { environment } from "../../../../environments/environment"

const API_BASE_URL = environment.apiUrl
@Injectable({
	providedIn: "root",
})
export class ApiService {
	private readonly http = inject(HttpClient)

	async get<T>(
		endpoint: string,
		params?: Record<string, string | number | boolean>
	): Promise<ApiResponse<T>> {
		let httpParams = new HttpParams()

		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== null && value !== undefined) {
					httpParams = httpParams.set(key, String(value))
				}
			})
		}
		return firstValueFrom(
			this.http.get<ApiResponse<T>>(`${API_BASE_URL}${endpoint}`, { params: httpParams })
		)
	}

	async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
		return firstValueFrom(this.http.post<ApiResponse<T>>(`${API_BASE_URL}${endpoint}`, data))
	}

	async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
		return firstValueFrom(this.http.put<ApiResponse<T>>(`${API_BASE_URL}${endpoint}`, data))
	}

	async delete<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
		return firstValueFrom(
			this.http.delete<ApiResponse<T>>(`${API_BASE_URL}${endpoint}`, { body: data })
		)
	}
}

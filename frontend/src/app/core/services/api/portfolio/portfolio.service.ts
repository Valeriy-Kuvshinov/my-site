import { Injectable, inject } from "@angular/core"
import { injectQuery, injectMutation, QueryClient } from "@tanstack/angular-query-experimental"

import { LocalizedString } from "@/shared/interfaces/locale"
import { PortfolioItem, PortfolioEntity } from "@/shared/interfaces/portfolio"

import { QUERY_CLIENT_TOKEN } from "@/core/tokens/query-client.token"

import { SystemStore } from "@/core/stores/system.store"

import { ApiService } from "../api.service"

export const portfolioKeys = {
	all: ["portfolio"] as const,
	lists: () => [...portfolioKeys.all, "list"] as const,
	detail: (id: number) => [...portfolioKeys.all, "detail", id] as const,
}

const PORTFOLIO_ENDPOINT = "portfolio"

@Injectable({
	providedIn: "root",
})
export class PortfolioService {
	private readonly api = inject(ApiService)

	private readonly store = inject(SystemStore)

	private readonly queryClient = inject<QueryClient>(QUERY_CLIENT_TOKEN)

	// Queries
	// ===============================
	getPortfolioItems() {
		return injectQuery(() => ({
			queryKey: portfolioKeys.lists(),
			queryFn: async (): Promise<PortfolioItem[]> => {
				const response = await this.api.get<PortfolioEntity[]>(PORTFOLIO_ENDPOINT)

				const items = response.data || []

				return items.map((item) => this.mapEntityToDisplayItem(item))
			},
		}))
	}

	getPortfolioItemById(id: number | null) {
		return injectQuery(() => ({
			queryKey: portfolioKeys.detail(id || 0),
			queryFn: async (): Promise<PortfolioItem | null> => {
				if (!id) return null

				const response = await this.api.get<PortfolioEntity>(`${PORTFOLIO_ENDPOINT}/${id}`)

				return response.data ? this.mapEntityToDisplayItem(response.data) : null
			},
			enabled: !!id,
		}))
	}

	// Mutations (For your future Admin UI)
	// ===============================
	saveItem() {
		return injectMutation(() => ({
			mutationFn: async (item: PortfolioEntity): Promise<PortfolioEntity> => {
				const endpoint = item.id
					? `${PORTFOLIO_ENDPOINT}/update/${item.id}`
					: `${PORTFOLIO_ENDPOINT}/add`

				const response = item.id
					? await this.api.put<PortfolioEntity>(endpoint, item)
					: await this.api.post<PortfolioEntity>(endpoint, item)

				if (!response.data) throw new Error("Server returned empty data on save")

				return response.data
			},
			onSuccess: (savedItem) => {
				this.queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() })

				if (savedItem.id) {
					this.queryClient.setQueryData(
						portfolioKeys.detail(savedItem.id),
						this.mapEntityToDisplayItem(savedItem)
					)
				}
				this.store.showSuccess("Saved!", "Portfolio item saved successfully.")
			},
			onError: (error: Error) => {
				this.store.showError("Save Failed", error.message)
			},
		}))
	}

	deleteItem() {
		return injectMutation(() => ({
			mutationFn: async (id: number): Promise<void> => {
				await this.api.delete(`${PORTFOLIO_ENDPOINT}/delete/${id}`)
			},
			onSuccess: (_, deletedId) => {
				this.queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() })
				this.queryClient.removeQueries({ queryKey: portfolioKeys.detail(deletedId) })

				this.store.showSuccess("Deleted", "Portfolio item removed.")
			},
			onError: (error: Error) => {
				this.store.showError("Delete Failed", error.message)
			},
		}))
	}

	// Helper: Map Backend Entity to Frontend Interface
	private mapEntityToDisplayItem(entity: PortfolioEntity): PortfolioItem {
		const lang = this.store.currentLanguage()

		const extractString = (val?: LocalizedString): string => {
			if (!val) return ""
			return val[lang] || val.en || ""
		}

		return {
			id: entity.id,
			title: extractString(entity.title),
			description: extractString(entity.description),
			imgAlt: extractString(entity.imgAlt),
			note: extractString(entity.note),
			imgDesktopSrc: entity.imgDesktopSrc,
			imgMobileSrc: entity.imgMobileSrc,
			linkUrl: entity.linkUrl,
			githubUrl: entity.githubUrl,
			isOpenSource: entity.isOpenSource,
		}
	}
}

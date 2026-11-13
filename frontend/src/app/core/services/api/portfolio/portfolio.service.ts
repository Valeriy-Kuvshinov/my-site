import { Injectable, Signal, inject } from "@angular/core"
import { injectQuery, injectMutation, QueryClient } from "@tanstack/angular-query-experimental"

import { LocalizedString, SupportedLanguage } from "@/shared/interfaces/locale"
import { PortfolioItem, PortfolioEntity } from "@/shared/interfaces/portfolio"

import { QUERY_CLIENT_TOKEN } from "@/core/tokens/query-client.token"

import { SystemStore } from "@/core/stores/system.store"

import { HttpService } from "../http.service"

export const portfolioKeys = {
	all: ["portfolio"] as const,
	lists: (search?: string, technologies?: string[]) =>
		[...portfolioKeys.all, "list", { search, technologies }] as const,
	detail: (id: number) => [...portfolioKeys.all, "detail", id] as const,
}

const PORTFOLIO_ENDPOINT = "portfolio"

function mapEntityToDisplayItem(entity: PortfolioEntity, lang: SupportedLanguage): PortfolioItem {
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
		imgDesktopSrc: entity.imgDesktopSrc || "",
		imgMobileSrc: entity.imgMobileSrc || "",
		linkUrl: entity.linkUrl || "",
		githubUrl: entity.githubUrl || "",
		isOpenSource: entity.isOpenSource || false,
		technologies: entity.technologies || [],
	}
}

@Injectable({
	providedIn: "root",
})
export class PortfolioService {
	private readonly http = inject(HttpService)

	private readonly store = inject(SystemStore)

	private readonly queryClient = inject<QueryClient>(QUERY_CLIENT_TOKEN)

	// Queries
	// ===============================
	getPortfolioItems(searchQuerySignal?: Signal<string>, techQuerySignal?: Signal<string[]>) {
		return injectQuery(() => {
			const search = searchQuerySignal ? searchQuerySignal() : undefined
			const technologies = techQuerySignal ? techQuerySignal() : undefined

			return {
				queryKey: portfolioKeys.lists(search, technologies),
				queryFn: async (): Promise<PortfolioItem[]> => {
					const params: Record<string, string> = {}

					if (search) params["search"] = search

					if (technologies && technologies.length > 0) {
						params["technologies"] = technologies.join(",")
					}
					const response = await this.http.get<PortfolioEntity[]>(
						PORTFOLIO_ENDPOINT,
						params
					)
					const items = response.data || []

					const currentLang = this.store.currentLanguage()

					return items.map((item) => mapEntityToDisplayItem(item, currentLang))
				},
			}
		})
	}

	getPortfolioItemById(id: number | null) {
		return injectQuery(() => ({
			queryKey: portfolioKeys.detail(id || 0),
			queryFn: async (): Promise<PortfolioItem | null> => {
				if (!id) return null

				const response = await this.http.get<PortfolioEntity>(`${PORTFOLIO_ENDPOINT}/${id}`)

				if (!response.data) return null

				const currentLang = this.store.currentLanguage()

				return mapEntityToDisplayItem(response.data, currentLang)
			},
			enabled: !!id,
		}))
	}

	// Mutations
	// ===============================
	saveItem() {
		return injectMutation(() => ({
			mutationFn: async (item: PortfolioEntity): Promise<PortfolioEntity> => {
				const endpoint = item.id
					? `${PORTFOLIO_ENDPOINT}/update/${item.id}`
					: `${PORTFOLIO_ENDPOINT}/add`

				const response = item.id
					? await this.http.put<PortfolioEntity>(endpoint, item)
					: await this.http.post<PortfolioEntity>(endpoint, item)

				if (!response.data) throw new Error("Server returned empty data on save")

				return response.data
			},
			onSuccess: (savedItem) => {
				this.queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() })

				if (savedItem.id) {
					const currentLang = this.store.currentLanguage()

					this.queryClient.setQueryData(
						portfolioKeys.detail(savedItem.id),
						mapEntityToDisplayItem(savedItem, currentLang)
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
				await this.http.delete(`${PORTFOLIO_ENDPOINT}/delete/${id}`)
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
}

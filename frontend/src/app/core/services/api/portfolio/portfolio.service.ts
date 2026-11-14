import { Injectable, inject, signal } from "@angular/core"

import { LocalizedString, SupportedLanguage } from "@/shared/interfaces/locale"
import { PortfolioItem, PortfolioEntity } from "@/shared/interfaces/portfolio"

import { SystemStore } from "@/core/stores/system.store"

import { HttpService } from "../http.service"

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

	private readonly _portfolioItems = signal<PortfolioItem[]>([])
	private readonly _isFetching = signal<boolean>(false)

	readonly portfolioItems = this._portfolioItems.asReadonly()
	readonly isFetching = this._isFetching.asReadonly()

	async fetchPortfolioItems(search?: string, technologies?: string[]): Promise<void> {
		this._isFetching.set(true)

		const params: Record<string, string> = {}

		if (search) params["search"] = search

		if (technologies && technologies.length > 0) {
			params["technologies"] = technologies.join(",")
		}
		try {
			const response = await this.http.get<PortfolioEntity[]>(PORTFOLIO_ENDPOINT, params)

			const currentLang = this.store.currentLanguage()

			const mapped = (response.data || []).map((item) =>
				mapEntityToDisplayItem(item, currentLang)
			)
			this._portfolioItems.set(mapped)
		} catch (err) {
			console.error("Failed to fetch portfolio", err)
			this._portfolioItems.set([])
		} finally {
			this._isFetching.set(false)
		}
	}

	async saveItem(item: PortfolioEntity): Promise<PortfolioEntity | null> {
		const endpoint = item.id
			? `${PORTFOLIO_ENDPOINT}/update/${item.id}`
			: `${PORTFOLIO_ENDPOINT}/add`

		try {
			const response = item.id
				? await this.http.put<PortfolioEntity>(endpoint, item)
				: await this.http.post<PortfolioEntity>(endpoint, item)

			if (!response.data) throw new Error("Server returned empty data on save")

			await this.fetchPortfolioItems()

			this.store.showSuccess("Saved!", "Portfolio item saved successfully.")

			return response.data
		} catch (error: any) {
			this.store.showError("Save Failed", error.message)
			return null
		}
	}

	async deleteItem(id: number): Promise<void> {
		try {
			await this.http.delete(`${PORTFOLIO_ENDPOINT}/delete/${id}`)

			this._portfolioItems.update((items) => items.filter((item) => item.id !== id))

			this.store.showSuccess("Deleted", "Portfolio item removed.")
		} catch (error: any) {
			this.store.showError("Delete Failed", error.message)
		}
	}
}

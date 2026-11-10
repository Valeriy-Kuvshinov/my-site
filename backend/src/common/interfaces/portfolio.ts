import { LocalizedString } from "./locale.js"

// API
export interface PortfolioEntity {
	id?: number
	title: LocalizedString
	description: LocalizedString
	imgDesktopSrc: string
	imgMobileSrc?: string
	imgAlt: LocalizedString
	linkUrl?: string
	githubUrl?: string
	note?: LocalizedString
	isOpenSource: boolean
	technologies?: string[]
}

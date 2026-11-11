import { LocalizedString } from "./locale"

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
	createdAt?: string
}

// Display
export interface PortfolioItem {
	id?: number
	title: string
	description: string
	imgDesktopSrc: string
	imgMobileSrc?: string
	imgAlt: string
	linkUrl?: string
	githubUrl?: string
	note?: string
	isOpenSource: boolean
	technologies?: string[]
	createdAt?: string
}

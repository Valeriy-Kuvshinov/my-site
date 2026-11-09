import { PortfolioItem } from "../interfaces/portfolio"

export function getPortfolioImageSrc(item: PortfolioItem, isMobile: boolean): string {
	if (isMobile && item.imgMobileSrc) return item.imgMobileSrc

	return item.imgDesktopSrc
}

export function getPortfolioImageRatio(item: Partial<PortfolioItem>, isMobile: boolean): string {
	if (isMobile && item.imgMobileSrc) return "9 / 16"

	return "16 / 9"
}

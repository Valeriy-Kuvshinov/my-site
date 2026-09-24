export type IconName = keyof typeof ICON_MAP

const GENERAL_ICONS = {
	crown: `<svg viewBox="0 0 36 36" width="100%" height="100%"><g data-name="Layer 3"><path d="M2.6 11.93a1.4 1.4 0 1 0 1.4 1.4 1.4 1.4 0 0 0-1.4-1.4" /><circle cx="33.83" cy="13.33" r="1.39" /><path d="stuff" /></g></svg>`,
	close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="100%" height="100%"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>`,
	expand: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="100%" height="100%"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 14v6h6m10-10V4h-6m-7 7l14-14m-14 0l14 14" /></svg>`,
}

export const ICON_MAP = {
	...GENERAL_ICONS,
}

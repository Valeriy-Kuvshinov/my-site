import { IconName } from "../components/icon/icon.map"

interface SocialLink {
	name: string
	url: string
	icon: IconName
	ariaLabel: string
}

export const SOCIAL_LINKS: SocialLink[] = [
	{
		name: "LinkedIn",
		url: "https://www.linkedin.com/in/valeriy-kuvshin-ov/",
		icon: "linkedin",
		ariaLabel: "LinkedIn profile (opens in a new tab)",
	},
	{
		name: "GitHub",
		url: "https://github.com/Valeriy-Kuvshinov",
		icon: "github",
		ariaLabel: "GitHub profile (opens in a new tab)",
	},
	{
		name: "Facebook",
		url: "https://www.facebook.com/valery.kuvshinov.75/",
		icon: "facebook",
		ariaLabel: "Facebook profile (opens in a new tab)",
	},
	{
		name: "Email",
		url: "mailto:contact@kuvware.com",
		icon: "mail",
		ariaLabel: "Send an email directly",
	},
]

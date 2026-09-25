import { Routes } from "@angular/router"

export const routes: Routes = [
	{
		path: "",
		loadComponent: () => import("./pages/home/page.component"),
		title: "VK Freelance Software",
	},
	{
		path: "contact",
		loadComponent: () => import("./pages/contact/page.component"),
		title: "Contact | VK Freelance Software",
	},
	{
		path: "about",
		loadComponent: () => import("./pages/about/page.component"),
		title: "About | VK Freelance Software",
	},
	{
		path: "portfolio",
		loadComponent: () => import("./pages/portfolio/page.component"),
		title: "Portfolio | VK Freelance Software",
	},
	{
		path: "reviews",
		loadComponent: () => import("./pages/reviews/page.component"),
		title: "Reviews | VK Freelance Software",
	},
	{
		path: "privacy-policy",
		loadComponent: () => import("./pages/privacy-policy/page.component"),
		title: "Privacy Policy | VK Freelance Software",
	},
	{
		path: "accessibility",
		loadComponent: () => import("./pages/accessibility/page.component"),
		title: "Acessibility Statement | VK Freelance Software",
	},
]

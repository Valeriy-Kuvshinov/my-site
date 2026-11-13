import { Routes } from "@angular/router"

import { adminGuard } from "./core/guards/admin.guard"

export const routes: Routes = [
	{
		path: "",
		loadComponent: () => import("./pages/home/page.component"),
	},
	{
		path: "contact",
		loadComponent: () => import("./pages/contact/page.component"),
	},
	{
		path: "about",
		loadComponent: () => import("./pages/about/page.component"),
	},
	{
		path: "portfolio",
		loadComponent: () => import("./pages/portfolio/page.component"),
	},
	{
		path: "services",
		loadComponent: () => import("./pages/services/page.component"),
	},
	{
		path: "privacy-policy",
		loadComponent: () => import("./pages/privacy-policy/page.component"),
	},
	{
		path: "accessibility",
		loadComponent: () => import("./pages/accessibility/page.component"),
	},
	{
		path: "terms",
		loadComponent: () => import("./pages/terms/page.component"),
	},
	{
		path: "login",
		loadComponent: () => import("./pages/login/page.component"),
	},
	{
		path: "admin",
		loadComponent: () => import("./pages/admin/page.component"),
		canActivate: [adminGuard],
	},
	{
		path: "**",
		loadComponent: () => import("./pages/not-found/page.component"),
	},
]

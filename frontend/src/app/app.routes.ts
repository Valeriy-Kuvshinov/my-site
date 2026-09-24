import { Routes } from "@angular/router"

export const routes: Routes = [
	{
		path: "",
		loadComponent: () => import("./pages/home/page.component"),
		title: "VK Freelance Software",
	},
	// {
	//     path: 'games',
	//     loadComponent: () => import('./games.component').then(m => m.GamesComponent),
	//     title: 'Games | Noffty Productions'
	// }
]

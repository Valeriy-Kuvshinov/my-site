import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SITE_URL = "https://kuvware.com"

const LOCALES = ["en", "ru", "he"]

const STATIC_ROUTES = [
	{ url: "", priority: 1.0, freq: "monthly" },
	{ url: "/portfolio", priority: 0.8, freq: "monthly" },
	{ url: "/services", priority: 0.8, freq: "monthly" },
	{ url: "/about", priority: 0.8, freq: "monthly" },
	{ url: "/contact", priority: 0.8, freq: "monthly" },
	{ url: "/privacy-policy", priority: 0.5, freq: "yearly" },
	{ url: "/accessibility", priority: 0.5, freq: "yearly" },
	{ url: "/terms", priority: 0.5, freq: "yearly" },
]

// If you have dynamic routes (like your games in Next.js), you can fetch them here.
// const res = await fetch('YOUR_API_ENDPOINT');
// const dynamicData = await res.json();

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`

// Generate routes for all locales
STATIC_ROUTES.forEach((route) => {
	LOCALES.forEach((locale) => {
		const localePath = locale === "en" ? "" : `/${locale}`

		const fullUrl = `${SITE_URL}${localePath}${route.url}/`
			.replace("//", "/")
			.replace(":/", "://")

		xml += `    <url>\n`
		xml += `        <loc>${fullUrl}</loc>\n`

		// Add alternate language links for SEO
		LOCALES.forEach((altLocale) => {
			const altPath = altLocale === "en" ? "" : `/${altLocale}`
			const altUrl = `${SITE_URL}${altPath}${route.url}/`
				.replace("//", "/")
				.replace(":/", "://")
			xml += `        <xhtml:link rel="alternate" hreflang="${altLocale}" href="${altUrl}" />\n`
		})

		xml += `        <changefrequency>${route.freq}</changefrequency>\n`
		xml += `        <priority>${route.priority}</priority>\n`
		xml += `    </url>\n`
	})
})

xml += `</urlset>`

fs.writeFileSync(path.join(__dirname, "../public/sitemap.xml"), xml, "utf8")

console.log(`Sitemap generated`)

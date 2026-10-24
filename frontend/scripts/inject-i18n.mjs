import fs from "fs"
import path from "path"

// Usage: node scripts/inject-i18n.mjs ru
const locale = process.argv[2]

if (!locale) throw new Error("Please provide a locale code (e.g., 'ru' or 'he')")

const jsonPath = path.resolve(`src/locale/${locale}/${locale}.json`)

const xlfPath = path.resolve(`src/locale/${locale}/messages.${locale}.xlf`)

if (!fs.existsSync(jsonPath)) throw new Error(`Missing ${locale}.json`)

if (!fs.existsSync(xlfPath)) fs.copyFileSync(path.resolve("src/locale/messages.xlf"), xlfPath)

const translations = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))

let xlfContent = fs.readFileSync(xlfPath, "utf-8")

for (const [id, targetText] of Object.entries(translations)) {
	const unitRegex = new RegExp(`(<trans-unit id="${id}".*?>\\s*<source>.*?<\\/source>)`, "g")

	xlfContent = xlfContent.replace(unitRegex, (match) => {
		if (match.includes("<target>")) {
			return match.replace(/<target>.*?<\/target>/, `<target>${targetText}</target>`)
		}
		return `${match}\n        <target>${targetText}</target>`
	})
}
fs.writeFileSync(xlfPath, xlfContent)

console.log(`Successfully injected translations into messages.${locale}.xlf`)

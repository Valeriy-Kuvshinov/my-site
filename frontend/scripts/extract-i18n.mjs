import fs from "fs"
import path from "path"

const localesDir = path.resolve("src/locale")

const xlfPath = path.join(localesDir, "messages.xlf")

const outputPath = path.join(localesDir, "source_strings.json")

const supportedLocales = ["ru", "he"]

// Read the fresh base XML
const xlfContent = fs.readFileSync(xlfPath, "utf-8")

// Extract strings to JSON
const regex = /<trans-unit id="([^"]+)".*?>\s*<source>(.*?)<\/source>/gs

const matches = [...xlfContent.matchAll(regex)]

const dictionary = {}

matches.forEach((match) => {
	dictionary[match[1]] = match[2]
})

fs.writeFileSync(outputPath, JSON.stringify(dictionary, null, 2))

console.log(`Extracted ${Object.keys(dictionary).length} strings to source_strings.json`)

// Distribute the fresh XML to locale folders
supportedLocales.forEach((locale) => {
	const localeFolder = path.join(localesDir, locale)
	const localeXlfPath = path.join(localeFolder, `messages.${locale}.xlf`)

	if (!fs.existsSync(localeFolder)) fs.mkdirSync(localeFolder, { recursive: true })

	// Overwrite the old locale XLF with the fresh template
	fs.copyFileSync(xlfPath, localeXlfPath)

	console.log(`Synced fresh base template to ${locale}/messages.${locale}.xlf`)
})

import fs from "fs"
import path from "path"

// Usage: node scripts/extract-i18n.mjs
const xlfPath = path.resolve("src/locale/messages.xlf")

const outputPath = path.resolve("src/locale/source_strings.json")

const xlfContent = fs.readFileSync(xlfPath, "utf-8")

// Match the ID and the exact inner content of the <source> tag
const regex = /<trans-unit id="([^"]+)".*?>\s*<source>(.*?)<\/source>/gs
const matches = [...xlfContent.matchAll(regex)]

const dictionary = {}

matches.forEach((match) => {
	dictionary[match[1]] = match[2]
})

fs.writeFileSync(outputPath, JSON.stringify(dictionary, null, 2))

console.log(`Extracted ${Object.keys(dictionary).length} strings to source_strings.json`)

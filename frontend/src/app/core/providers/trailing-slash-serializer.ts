import { DefaultUrlSerializer, UrlTree } from "@angular/router"

export class TrailingSlashSerializer extends DefaultUrlSerializer {
	override serialize(tree: UrlTree): string {
		const url = super.serialize(tree)

		if (url === "/") return url

		const pathSplit = url.split("?")
		const path = pathSplit[0]
		const query = pathSplit[1] ? `?${pathSplit[1]}` : ""

		if (!path.endsWith("/")) return `${path}/${query}`

		return url
	}
}

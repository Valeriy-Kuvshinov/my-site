import { Component, ChangeDetectionStrategy, inject, signal } from "@angular/core"

import { LocalizedString, SupportedLanguage } from "@/shared/interfaces/locale"

import { SystemStore } from "@/core/stores/system.store"

import { SvgIconComponent } from "@/shared/components/icon/icon.component"
import { ImageContainerComponent } from "@/shared/components/general/image-container.component"

export interface Review {
	id: string
	clientName: string
	logoSrc: string
	text: LocalizedString
	originalLang: SupportedLanguage
	servicesProvided: LocalizedString[]
}

export const CLIENT_REVIEWS: Review[] = [
	{
		id: "noffty-productions",
		clientName: "Noffty Productions",
		logoSrc: "/images/noffty.avif",
		originalLang: "en",
		servicesProvided: [
			{
				en: "Custom Software Development",
				he: "פיתוח תוכנה מותאמת אישית",
				ru: "Разработка программного обеспечения на заказ",
			},
		],
		text: {
			en: "We are beyond satisfied with Valeriy's high quality work. No feature was off the table and was done in record times, even under relatively short notice. Truly a wonderful person to work with, greatly recommended.",
			he: "אנו מרוצים מעל ומעבר מהעבודה האיכותית של ולרי. שום פיצ'ר לא נפסל מראש, והכול בוצע בזמן שיא, גם בהתראה קצרה יחסית. אדם נפלא באמת לעבוד איתו, מומלץ בחום.",
			ru: "Мы более чем довольны высококачественной работой Валерия. Он брался за любые функции, и всё было сделано в рекордные сроки, даже когда времени на подготовку было сравнительно мало. Поистине замечательный человек, с которым приятно работать, очень рекомендуем.",
		},
	},
	{
		id: "micro-mineral-israel",
		clientName: "Micro Mineral Israel",
		logoSrc: "/images/micro-mineral.avif",
		originalLang: "he",
		servicesProvided: [
			{
				en: "System Rescue & Maintenance",
				he: "הצלה ותחזוקת מערכות",
				ru: "Спасение и обслуживание систем",
			},
			{
				en: "A11y Audits & ARIA Fixes",
				he: "מבדקי נגישות ותיקוני ARIA",
				ru: "Аудит доступности и исправление ARIA",
			},
		],
		text: {
			en: "I recommend Valeriy. Very precise and thorough, he did several jobs for me that I am really satisfied with. I recommend him to anyone who wants professionalism, thoroughness, and solutions beyond expectations: that's only Valeriy. Thank you so much for the privilege of getting to know you ❤️",
			he: "אני ממליץ על ולרי מדויק ויסודי מאוד עשה לי כמה עבודות שאני ממש מרוצה ממליץ מי שרוצה מקצועיות יסודיות פתרונות מעל המצופה זה רק ולרי תודה רבה שזכיתי להכיר אותך❤️",
			ru: "Рекомендую Валерия. Очень точный и основательный, он выполнил для меня несколько работ, которыми я по-настоящему доволен. Всем, кому нужны профессионализм, основательность и решения сверх ожиданий, рекомендую только Валерия. Огромное спасибо, что мне посчастливилось с тобой познакомиться ❤️",
		},
	},
	{
		id: "the-vision-israel",
		clientName: "The Vision Israel",
		logoSrc: "/images/vision.avif",
		originalLang: "en",
		servicesProvided: [
			{
				en: "Custom Software Development",
				he: "פיתוח תוכנה מותאמת אישית",
				ru: "Разработка программного обеспечения на заказ",
			},
		],
		text: {
			en: "Valeriy has been working for us for a while now, with our cooperation growing over time. He understands what we need, explains things clearly, and delivers work we can rely on. I’d recommend him to anyone looking for a long-term engineering partner.",
			he: "ולרי עובד איתנו כבר תקופה, ושיתוף הפעולה בינינו רק הולך ומתרחב עם הזמן. הוא מבין בדיוק מה אנחנו צריכים, מסביר דברים בצורה ברורה, ומספק עבודה שאפשר לסמוך עליה. אני ממליץ עליו לכל מי שמחפש שותף טכנולוגי לטווח ארוך.",
			ru: "Валерий работает с нами уже некоторое время, и наше сотрудничество со временем только расширяется. Он отлично понимает наши потребности, ясно всё объясняет и выполняет работу, на которую можно положиться. Я рекомендую его всем, кто ищет технического партнера для долгосрочного сотрудничества.",
		},
	},
]

@Component({
	selector: "app-reviews",
	standalone: true,
	imports: [SvgIconComponent, ImageContainerComponent],
	templateUrl: "./reviews.html",
	styleUrl: "./reviews.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: "flex flex-col items-center w-full min-h-screen gap-8",
	},
})
export class ReviewsComponent {
	private readonly store = inject(SystemStore)

	protected readonly currentLang = this.store.currentLanguage
	protected readonly reviews = CLIENT_REVIEWS

	protected readonly showingOriginalIds = signal<Set<string>>(new Set())

	protected readonly starsArray = Array.from({ length: 5 })

	toggleOriginal(id: string) {
		this.showingOriginalIds.update((currentSet) => {
			const newSet = new Set(currentSet)

			if (newSet.has(id)) newSet.delete(id)
			else newSet.add(id)

			return newSet
		})
	}

	isShowingOriginal(id: string): boolean {
		return this.showingOriginalIds().has(id)
	}

	getReviewText(review: Review): string {
		const langToUse = this.isShowingOriginal(review.id)
			? review.originalLang
			: this.currentLang()

		return review.text[langToUse] || review.text.en
	}

	getTextDirClass(review: Review): string {
		const langToUse = this.isShowingOriginal(review.id)
			? review.originalLang
			: this.currentLang()

		return langToUse === "he" ? "right-dir" : "left-dir"
	}

	getServiceName(service: LocalizedString): string {
		return service[this.currentLang()] || service.en
	}

	getLanguageName(lang: SupportedLanguage): string {
		switch (lang) {
			case "he":
				return $localize`:@@lang.hebrew:Hebrew`
			case "ru":
				return $localize`:@@lang.russian:Russian`
			default:
				return $localize`:@@lang.english:English`
		}
	}
}

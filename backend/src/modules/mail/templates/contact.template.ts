interface TemplateData {
	name: string
	email: string
	title: string
	requestType: string
	message: string
	language: "en" | "ru" | "he"
}

const SITE_LOGO = "https://res.cloudinary.com/oee6altn/image/upload/v1792666160/small_logo.png"

export function getAdminContactTemplate(data: TemplateData): string {
	const { name, requestType, message, email } = data

	return getEmailBodyTemplate(
		`
        <p>Dear admin, a new message from Contact Us has arrived.</p>
        <p>Message type: ${requestType}</p>
        <hr>
        <p>${message}</p>
        <hr>
        <p>This message was sent by <b>${name}</b>.</p>
        <p>Contact them back directly at: <a href="mailto:${email}" style="color: #0d3870;">${email}</a></p>
    `,
		"en"
	)
}

export function getUserContactTemplate(data: TemplateData): string {
	const { name, title, message, language } = data

	if (language === "ru") {
		return getEmailBodyTemplate(
			`
            <p>Здравствуйте, ${name},</p>
            <p>Спасибо за обращение в Kuvshinov Software.</p>
            <p>Мы успешно получили ваше сообщение на тему <b>${title}</b> и рассмотрим его в ближайшее время.</p>
            <hr>
            <p><i>Ваше исходное сообщение:</i></p>
            <p>${message}</p>
            <hr>
            <p>Это автоматическое подтверждение. Ответы на этот адрес электронной почты не будут прочитаны.</p>
        `,
			"ru"
		)
	}
	if (language === "he") {
		return getEmailBodyTemplate(
			`
            <p>שלום ${name},</p>
            <p>תודה על פנייתך ל-Kuvshinov Software.</p>
            <p>קיבלנו בהצלחה את הודעתך בנושא <b>${title}</b> ונבדוק אותה בהקדם.</p>
            <hr>
            <p><i>ההודעה המקורית שלך:</i></p>
            <p>${message}</p>
            <hr>
            <p>זהו אישור אוטומטי. פניות שיישלחו לכתובת דוא"ל זו לא ייענו.</p>
        `,
			"he"
		)
	}
	return getEmailBodyTemplate(
		`
        <p>Hi ${name},</p>
        <p>Thank you for reaching out to Kuvshinov Software.</p>
        <p>We have successfully received your message regarding <b>${title}</b> and will review it shortly.</p>
        <hr>
        <p><i>Your original message:</i></p>
        <p>${message}</p>
        <hr>
        <p>This is an automated confirmation. Replies to this email address will be ignored.</p>
    `,
		"en"
	)
}

function getEmailBodyTemplate(content: string, language: "en" | "ru" | "he"): string {
	const isRtl = language === "he"
	const dirAttribute = isRtl ? 'dir="rtl"' : 'dir="ltr"'
	const alignAttribute = isRtl ? "right" : "left"

	let footer = "<br>Kuvshinov Software<br>"

	if (language === "ru") footer = "С уважением,<br>Kuvshinov Software<br>"

	if (language === "he") footer = "בברכה,<br>Kuvshinov Software<br>"

	return `
    <div style="display: flex; height: 100%; margin: 0 auto; max-width:800px;">
        <div ${dirAttribute} style="width: 100%; padding: 20px; font-size: 1rem; color: #0a0a0a; text-align: ${alignAttribute};">
            <a href="https://kuvware.com" style="display: block; width: fit-content; margin: 0 auto;">
                <img src="${SITE_LOGO}" alt="Kuvware logo" style="height: 48px; width: 64px;">
            </a>
            ${content}
            <p>${footer}</p>
        </div>
    </div>`
}

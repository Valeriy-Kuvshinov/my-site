export function getAdminContactTemplate(
	name: string,
	email: string,
	requestType: string,
	message: string,
	siteLogo: string
): string {
	return wrapInLayout(
		`
        <p>Dear admin, a new message from Contact Us has arrived.</p>
        <p>Message type: ${requestType}</p>
        <hr>
        <p>${message}</p>
        <hr>
        <p>This message was sent by <b>${name}</b>.</p>
        <p>Contact them back directly at: <a href="mailto:${email}" style="color: #fff132;">${email}</a></p>
    `,
		siteLogo
	)
}

export function getUserContactTemplate(
	name: string,
	title: string,
	message: string,
	siteLogo: string
): string {
	return wrapInLayout(
		`
        <p>Hi ${name},</p>
        <p>Thank you for reaching out to VK Freelance Software.</p>
        <p>We have successfully received your message regarding <b>${title}</b> and will review it shortly.</p>
        <hr>
        <p><i>Your original message:</i></p>
        <p>${message}</p>
        <hr>
        <p>This is an automated confirmation. Replies to this email address will be ignored.</p>
    `,
		siteLogo
	)
}

function wrapInLayout(content: string, siteLogo: string): string {
	return `
    <div style="display: flex; height: 100%; margin: 0 auto; max-width:800px; background-color: #0a0a0a;">
        <div style="width: 100%; padding: 20px; font-size: 1rem; color: #F5F5F5; background-color: #0a0a0a;">
            <a href="https://vkfreelancesoftware.com" style="display: block; width: fit-content; margin: 0 auto; color: #F5F5F5;">
                <img src="${siteLogo}" alt="VK Freelance Software" style="height: 32px; width: 32px;">
            </a>
            ${content}
            <p>Sincerely,<br>VK Freelance Software<br></p>
        </div>
    </div>`
}

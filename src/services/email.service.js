import { transporter } from "../utils.js"

export const sendEmail = async (email) => {
    await transporter.sendMail({
        from: 'Equipo de desarrollo',
        to: email.to,
        subject: email.subject,
        html: email.html
    })
}
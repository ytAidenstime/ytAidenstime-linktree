import nodemailer from "nodemailer";
import database from "./database.js";

import { getConfig } from "./config.js";

const config = await getConfig("configurations/config.json");

const transporter = nodemailer.createTransport({
    host: config.settings.smtp.host,
    port: config.settings.smtp.port,
    secure: config.settings.smtp.secure,
    auth: {
        user: config.settings.smtp.auth.user,
        pass: config.settings.smtp.auth.pass
    }
})

export default async function sendMail(reciever, subject, content) {
    const date = new Date();

    const header = `
        <h1>Mailing List | ${date.getMonth()}/${date.getDay()}/${date.getFullYear()}</h1>
        <h3>Written by Aiden Smith</h3>
    `

    const footer = `
        <p>to opt out of this Mailing list use this link <a href="${config.settings.frontend.url}/emails/optout" target="_blank">opt out now</a></p>
    `

    await transporter.sendMail({
        from: `ADevelopments | <example@aidensdevteam.com>`,
        to: reciever,
        subject: subject,
        html: content
    })
}
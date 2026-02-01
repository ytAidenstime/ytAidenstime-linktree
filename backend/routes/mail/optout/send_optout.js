import database from "../../../util/database.js";

import SendEmail from "../../../util/email.js";
import { generateCode } from "../../../util/security/code_generation.js";

import { getConfig } from "../../../util/config.js";

const config = await getConfig("configurations/config.json");

export default async function send_optout(req, res) {
    const data = req.body;
    if(!data.email) return res.status(400).json({
        error: "Missing Data",
        status: false,
        message: "The data provided was not expected"
    })

    const email = data.email;

    const db = new database();
    db.connect();

    const connection = db.get();

    const [rows] = await connection.promise().query("SELECT * FROM emails WHERE email = ?", [email]);

    if(rows.length == 0) {
        return res.status(409).json({
            error: "Doesn't Exist",
            status: false,
            message: "the email provided is not in our system"
        })
    }

    const code = generateCode();

    await connection.promise().query("INSERT INTO deletion_requests (email, code) VALUES (?, ?) ON DUPLICATE KEY UPDATE email = VALUES(email), code = VALUES(code)", [email, code.toString()]);

    db.close();

    SendEmail(email, "Mail Optout", `to opt out of emails go <a href="${config.settings.frontend.url}/emails/confirm_optout/${email}" target="_blank">here</a> and type this code: <h1>${code}</h1>`);

    res.json({
        status: true,
        message: "Successfully sent check your email please"
    })
}
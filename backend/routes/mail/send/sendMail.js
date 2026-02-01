import { getConfig } from "../../../util/config.js";
import database from '../../../util/database.js';

import sendMailD from "../../../util/email.js";

const config = await getConfig("configurations/config.json");

export default async function sendMail(req, res) {
    const validKeys = config.settings.security.keys;
    const validBody = ["email", "subject", "html"];

    for(let i = 0; i < validBody.length; i++) {
        if(!req.body[validBody[i]]) {
            return res.status(401).json({ error: "Request did not have the required parts", status: false });
        }
    }

    const email = req.body.email;
    const subject = req.body.subject;
    const html = req.body.html;

    if(!req.get("authentication_key")) {
        return res.status(401).json({ error: "Unauthorized: Invalid or missing key", status: false });
    }

    const key = req.get("authentication_key");

    if(!validKeys.includes(key)) {
        return res.status(401).json({ error: "Unauthorized: Invalid or missing key", status: false });
    }

    if(email == "mailing@list") {
        const db = new database();
        db.connect();

        const connection = db.get();

        const [rows] = await connection.promise().query("SELECT * FROM emails");

        for(let i = 0; i < rows.length; i++) {
            const emailList = rows[i].email;

            await sendMailD(emailList, subject, html);
        }
        res.json({
            status: true,
            message: "Success"
        })
    } else {
        await sendMailD(email, subject, html);

        res.json({
            status: true,
            message: "Success"
        })
    }
}
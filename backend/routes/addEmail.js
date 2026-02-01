import database from "../util/database.js";

import SendEmail from "../util/email.js";

export default async function AddEmail(req, res) {
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

    const [rows] = await connection.promise().query("SELECT 1 FROM emails WHERE email = ? LIMIT 1", [email]);

    if(rows.length > 0) {
        return res.status(409).json({
            error: "Data Exists",
            status: false,
            message: "the email provided is already in our system"
        })
    }

    await connection.promise().query("INSERT INTO emails (email) VALUES (?)", [email]);
    db.close();

    res.status(201).json({
        message: "Successfully added you to the email list!",
        status: true
    })

    SendEmail(email, "Joined", "Hey we just wanted to thank you for joining the mailing list and we really appreciate you doing so.");
}
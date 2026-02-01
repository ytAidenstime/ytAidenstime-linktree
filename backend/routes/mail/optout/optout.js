import database from "../../../util/database.js";

export default async function optout(req, res) {
    const data = req.body;

    if(!data.email && !data.code) {
        return res.status(409).json({
            error: "Doesn't Exist",
            status: false,
            message: "the email provided is not in our system"
        })
    }

    const email = data.email;
    const code = data.code;

    const db = new database();
    db.connect();

    const connection = db.get();

    const [rows] = await connection.promise().query(`SELECT email, code FROM deletion_requests WHERE email = ? AND code = ?`, [email, code]);
        
    if(rows.length == 0) {
        return res.status(409).json({
            error: "Doesn't Exist",
            status: false,
            message: "the data provided is not in our system"
        })
    }

    await connection.promise().query("DELETE FROM deletion_requests WHERE email = ? AND code = ?", [email, code]);
    await connection.promise().query("DELETE FROM emails WHERE email = ?", [email]);

    res.json({
        status: true,
        message: "Successfully removed from our mailing list"
    })
}
import database from "../../util/database.js";
import { getConfig } from "../../util/config.js";

const config = await getConfig("configurations/config.json");

export default async function getListUsers(req, res) {
    const validKeys = config.settings.security.keys;

    if(!req.get("authentication_key")) {
        return res.status(401).json({ error: "Unauthorized: Invalid or missing key", status: false });
    }

    const key = req.get("authentication_key");
    if(!validKeys.includes(key)) {
        return res.status(401).json({ error: "Unauthorized: Invalid or missing key", status: false });
    }

    const db = new database();
    db.connect();

    const connection = db.get();

    const [rows] = await connection.promise().query('SELECT COUNT(*) FROM emails');

    res.json({
        status: true,
        total: rows[0]["COUNT(*)"]
    })
}
import database from "./util/database.js";

async function database_install() {
    console.log("Attempting to install the Database");

    const db = new database();
    db.connect();

    const connection = db.get();
    
    const [rows] = await connection.promise().query(`SELECT COUNT(*) AS tableCount FROM information_schema.tables WHERE table_schema = ?`, ['linktree'])

    if(rows[0].tableCount > 0) {
        console.log("Sorry but you need to empty your database first!");
        return;
    }

    // install stats
    await connection.promise().query(`CREATE TABLE visits (
            id INT AUTO_INCREMENT PRIMARY KEY,
            timestamp TIMESTAMP NOT NULL
        )`)

    // emails
    await connection.promise().query(`CREATE TABLE emails (
            email VARCHAR(255) PRIMARY KEY
        )`)

    // request deletion
    await connection.promise().query(`CREATE TABLE deletion_requests (
            email VARCHAR(255) PRIMARY KEY,
            code VARCHAR(255) NOT NULL
        )`)

    db.close();
    console.log("Database Successfully installed!")
}
database_install();
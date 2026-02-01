import mysql from "mysql2";

import { getConfig } from "./config.js";

const config = await getConfig("configurations/config.json");

export default class Database {
    constructor() {
        this.host = config.settings.database.host;
        this.port = config.settings.database.port;
        this.username = config.settings.database.username;
        this.password = config.settings.database.password;
        this.database = config.settings.database.database;

        this.connection = null;
    }

    connect() {
        this.connection = mysql.createConnection({
            host: this.host,
            port: this.port,
            user: this.username,
            password: this.password,
            database: this.database
        })
    }

    get() {
        return this.connection;
    }

    close() {
        this.connection.end();
    }
}
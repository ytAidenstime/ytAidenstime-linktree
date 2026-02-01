import express from "express";
import bodyParser from "body-parser";
import { RateLimiterMemory } from "rate-limiter-flexible";
import cors from "cors";
import database from "./util/database.js";

import { getConfig } from "./util/config.js";

// routes
import addEmail from "./routes/addEmail.js";
import sendOptout from "./routes/mail/optout/send_optout.js";
import optout from "./routes/mail/optout/optout.js";
import getListUsers from "./routes/stats/getListUsers.js";

// restricted routes
import sendMail from "./routes/mail/send/sendMail.js";

const config = await getConfig("configurations/config.json");

const app = express();

// rate limiting
const options = {
    points: config.settings.security.ratelimit.points,
    duration: config.settings.security.ratelimit.duration
}

const rateLimiter = new RateLimiterMemory(options);

const addVisit = () => {
    const db = new database();
    db.connect();

    const connection = db.get();

    const sql = `INSERT INTO visits (timestamp) VALUES (?)`;

    connection.promise().execute(sql, [new Date()]);
    db.close();
}

// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    rateLimiter.consume(req.ip, 1).then(() => {
        // add visit
        addVisit();

        // continue the route
        next();
    }).catch(() => {
        res.status(429).json({
            status: 429,
            message: "Too many requests, Please try again later.",
            retryAfter: `${config.settings.security.ratelimit.duration} seconds`
        })
    })
})

// routes
app.post("/add_email", addEmail);
app.post("/optout/mail/confirm", optout);
app.post("/optout/mail/send", sendOptout);
app.post("/mail/send", sendMail);

app.get("/info/total/users", getListUsers);

app.listen(config.settings.webserver.port, console.log("============================\nThanks for choosing this software\nYour Backend is now up and running!\n============================"))
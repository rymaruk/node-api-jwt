import redisClient from "../redis/redis.client.js";
import jwt from "jsonwebtoken";
import isEqual from "lodash/isEqual";

export default function authenticateUser(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token === null) res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
        const username = payload?.username;
        if (err || !username) return res.sendStatus(403);

        const redisConnect = await redisClient.connect();
        const storedCredential = await redisConnect.get(username);
        const storedToken = JSON.parse(storedCredential)?.token;
        await redisConnect.disconnect();

        if (!storedCredential || !isEqual(token, storedToken) ) return res.sendStatus(403);

        req.user = payload;
        next();
    });
}
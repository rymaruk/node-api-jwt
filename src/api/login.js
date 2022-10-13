import generateAccessToken from "../utils/generateAccessToken.js";
import jwt from "jsonwebtoken";
import redisClient from "../redis/redis.client.js";

async function apiLogin(req, res) {
    try {
        const payload = req.body; // {username: "SomeName", key: any, ... }
        const username = payload?.username;
        if(!username) return res.sendStatus(422);

        const token = generateAccessToken(payload);
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);

        const redisConnect = await redisClient.connect();
        await redisConnect.set(username, JSON.stringify({token, refreshToken}));
        await redisConnect.disconnect();

        res.json({token, refreshToken});
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export default apiLogin;
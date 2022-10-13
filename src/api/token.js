import jwt from "jsonwebtoken";
import redisClient from "../redis/redis.client.js";
import generateAccessToken from "../utils/generateAccessToken.js";

async function apiToken(req, res) {
    const refreshToken = req.body?.refreshToken;
    if (!refreshToken) return res.sendStatus(422);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, payload) => {
        try {
            const username = payload?.username;
            if(!username) return res.sendStatus(403);

            const redisConnect = await redisClient.connect();
            const storedCredential = await redisConnect.get(username);

            if(!storedCredential) {
                await redisConnect.disconnect();
                return res.sendStatus(403);
            }

            const parsedStoredCredential = JSON.parse(storedCredential);

            if (err || !isEqual(refreshToken, parsedStoredCredential?.refreshToken)) return res.sendStatus(403);

            const token = generateAccessToken(payload);

            await redisConnect.set(
                username,
                JSON.stringify({token, refreshToken: parsedStoredCredential?.refreshToken})
            );

            await redisConnect.disconnect();

            res.json({token});

        } catch (err) {
            res.sendStatus(500);
        }
    });
}

export default apiToken;
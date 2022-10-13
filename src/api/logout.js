import redisClient from "../redis/redis.client.js";

async function apiLogout(req, res) {
    try {
        const username = req?.user?.username;
        const redisConnect = await redisClient.connect();
        await redisConnect.del(username);
        await redisConnect.disconnect();

        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }

}

export default apiLogout;
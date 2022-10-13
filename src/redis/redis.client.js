import {createClient} from "redis";

class RedisClient {

  async connect() {
    const redisClient = createClient();
    await redisClient.connect();

    redisClient.on('error', (err) => {
      console.log('Redis Client Error', err);
      throw Error (err)
    });

    return redisClient;
  }

}
const redisClient = new RedisClient();

export default redisClient
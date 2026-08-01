import {RedisClient} from "../config/redis.js";

export const judge0RateLimiter = async (req, res, next) => {
    try {
        const userId = req.result._id;
        const redisKey = `judge0_cooldown:${userId}`;

        const exists = await RedisClient.exists(redisKey);
        if (exists) {
            return res.status(429).json({
                success: false,
                message: "Please wait 10 seconds before making another request."
            });
        }

        // if key do not exist create one
        await RedisClient.set(redisKey, "locked", {
            EX: 10,   // automatically expiry after 10s
            NX: true    // Only set the key if it does NOT already exist
            // Suppose two requests arrive almost simultaneously.
            /* Request A  SET key EX 10
               Request B  SET key EX 10*/   // The second request resets the timer back to 10 seconds.
        });

        next();

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
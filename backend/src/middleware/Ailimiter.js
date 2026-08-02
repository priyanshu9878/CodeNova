import {rateLimit} from "express-rate-limit";

export const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour

    max: 20,

    keyGenerator: (req) => req.result?._id?.toString() || req.ip,

    message: {
        message: "AI limit exceeded. Try again after an hour."
    },

    standardHeaders: true,
    legacyHeaders: false,
});

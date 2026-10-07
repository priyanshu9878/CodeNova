import { rateLimit, ipKeyGenerator } from "express-rate-limit";

export const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,

    keyGenerator: (req) => {
        // Prefer the authenticated user id when available
        if (req.result?._id) {
            return req.result._id.toString();
        }
        // Fallback to IP – must use the helper for IPv6 safety
        return ipKeyGenerator(req.ip);   // or ipKeyGenerator(req.ip, 56)
    },

    message: {
        message: "AI limit exceeded. Try again after an hour."
    },

    standardHeaders: true,
    legacyHeaders: false,
});

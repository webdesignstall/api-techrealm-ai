import rateLimit from 'express-rate-limit';

const limiterHelper = (time: number, max: number) => {
  return rateLimit({
    windowMs: time * 60 * 1000, // 1 Hours
    max: max, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
};

export default limiterHelper;

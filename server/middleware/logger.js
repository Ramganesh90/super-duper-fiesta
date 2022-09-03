import winston from "winston";

const logger = winston.createLogger({
    transports: [new winston.transports.Console()]
});

export default function (req, res, next) {
    logger.info(req.url, { service: "tiny-app", ts: new Date().toISOString() });
    next();
}

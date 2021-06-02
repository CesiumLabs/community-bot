import { Logger } from "../../utils/Logger";
const logger = new Logger(null);

process.on("unhandledRejection", (error, rejected) => {
    logger.warn(`[${new Date().toLocaleString()}] | Unhandled Rejection`);
    logger.warn(error?.toString() ?? rejected.toString());
});

process.on("uncaughtException", (error) => {
    logger.error(`[${new Date().toLocaleString()}] | Uncaught Exception:\n\n${error.toString()}`);
});

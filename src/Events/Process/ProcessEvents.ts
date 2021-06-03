import { Logger } from "../../utils/Logger";
const logger = new Logger(null);

process.on("unhandledRejection", (error, rejected) => {
    logger.warn(`Unhandled Rejection`);
    logger.warn(error?.toString() ?? rejected.toString());
});

process.on("uncaughtException", (error) => {
    logger.error(`Uncaught Exception:\n\n${error.toString()}`);
});

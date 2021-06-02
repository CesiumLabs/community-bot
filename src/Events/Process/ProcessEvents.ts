import { Logger } from "../../utils/Logger";
const logger = new Logger(null);

process.on("unhandledRejection", () => {
    logger.warn(`[${new Date().toLocaleString()}] | Unhandled Rejection`);
});

process.on("uncaughtException", (error) => {
    logger.error(`[${new Date().toLocaleString()}] | Uncaught Exception:\n\n${error.toString()}`);
});

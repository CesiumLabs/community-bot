import { config } from "dotenv";
import { weeknd } from "./bot";
import "./Events/Process/ProcessEvents";

weeknd.logger.debug(`Application started, Node ENV ${process.env.NODE_ENV}!`);

// load .env
weeknd.logger.info("Loading ENV...");
config();
weeknd.logger.success("Loaded ENV!");

const start = async () => {
    // init bot
    await weeknd.loadEvents();
    await weeknd.loadCommands();
    await weeknd.login();
};

start();

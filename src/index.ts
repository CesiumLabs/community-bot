import { config } from "dotenv";
import { weeknd } from "./bot";
import fetch from "node-fetch";
import "./Events/Process/ProcessEvents";

// we need some globals, yay!
Object.defineProperty(globalThis, "fetch", {
    value: fetch,
    writable: true,
    configurable: true,
    enumerable: false
});

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
    await weeknd.application?.fetch();
};

start();

import { config } from "dotenv";
import { weeknd } from "./bot";

// load .env
config();

const start = async () => {
    await weeknd.login();
}

start();
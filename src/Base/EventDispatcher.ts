import { ClientEvents } from "discord.js";
import { Util } from "../utils/Util";
import { Weeknd } from "./Weeknd";

class EventDispatcher {
    client: Weeknd;
    name: keyof ClientEvents;

    constructor(client: Weeknd, name: keyof ClientEvents) {
        this.client = client;
        this.name = name;

        Util.hideProp(this, "client");
    }

    execute(...args: any[]) {
        /* Placeholder */
    }
}

export { EventDispatcher };

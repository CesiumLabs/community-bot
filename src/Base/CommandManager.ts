import { Weeknd } from "./Weeknd";
import { Collection } from "discord.js";
import { CommandDispatcher } from "./CommandDispatcher";

class CommandManager {
    client: Weeknd;
    cache: Collection<string, CommandDispatcher | string>;

    constructor(client: Weeknd) {
        this.client = client;
        this.cache = new Collection();
    }

    register(name: string, dispatcher: CommandDispatcher | string) {
        if (!this.cache.has(name)) this.cache.set(name, dispatcher);

        return this;
    }

    unregister(name: string) {
        return this.cache.delete(name);
    }

    includes(name: string) {
        return this.cache.has(name);
    }

    resolve(name: string) {
        const dispatcher = this.cache.get(name);
        return typeof dispatcher === "string" ? (this.cache.get(dispatcher) as CommandDispatcher) : dispatcher;
    }
}

export { CommandManager };

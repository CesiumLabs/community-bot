import { Weeknd } from "./Weeknd";
import { Collection } from "discord.js";
import { CommandDispatcher } from "./CommandDispatcher";
import { Util } from "../utils/Util";

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

    reload(name: string) {
        const command = this.resolve(name);
        if (!command) return false;

        const reImport = Util.safeRequire(command.location);
        if (!reImport) return false;

        // remove previous
        this.unregister(command.name);
        command.config.aliases?.forEach((alias) => this.unregister(alias));

        // set new
        const newCommand = new (reImport.default || reImport)(this.client) as CommandDispatcher;

        newCommand.configure({
            location: command.location,
            category: command.config.category
        });

        this.register(newCommand.name, newCommand);
        newCommand.config.aliases?.forEach((alias: string) => this.register(alias, newCommand.name));

        return true;
    }
}

export { CommandManager };

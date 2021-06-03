import { Weeknd } from "./Weeknd";
import { Message, PermissionResolvable } from "discord.js";
import { Util } from "../utils/Util";

export interface CommandConfig {
    name?: string;
    description?: string;
    aliases?: string[];
    permissions?: PermissionResolvable[];
    private?: boolean;
    category?: string;
    location?: string;
    cooldown?: number;
}

class CommandDispatcher {
    client: Weeknd;
    config: CommandConfig;

    constructor(client: Weeknd) {
        this.client = client;
        this.config = {
            name: "unknown",
            description: "No description available",
            aliases: [],
            permissions: [],
            private: false,
            category: "Others",
            location: `${__filename}`,
            cooldown: 1000
        };

        Util.hideProp(this, "client");
    }

    get name() {
        return this.config.name!;
    }

    get location() {
        return this.config.location!;
    }

    configure(config?: CommandConfig) {
        this.config = Object.assign({}, this.config, config);

        return this;
    }

    source() {
        return this.execute.toString();
    }

    toString() {
        return this.source();
    }

    toJSON() {
        return this.config;
    }

    execute(message: Message, args: string[]) {
        /* Placeholder */
    }
}

export { CommandDispatcher };

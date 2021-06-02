import { Client, ClientEvents, Intents } from "discord.js";
import { Database } from "../Database/Database";
import { promises as fs } from "fs";
import { Config as BotConfig } from "../../config";
import { Util } from "../utils/Util";
import { EventDispatcher as InternalEventDispatcher } from "./EventDispatcher";
import { Logger } from "../utils/Logger";
import { CommandManager } from "./CommandManager";
import { CommandDispatcher } from "./CommandDispatcher";
import { ClientUtils } from "./ClientUtils";

class Weeknd extends Client {
    public database: Database;
    public config = BotConfig;
    public logger: Logger;
    public commands: CommandManager;
    public utils: ClientUtils;

    constructor() {
        super({
            partials: ["REACTION", "MESSAGE", "USER", "GUILD_MEMBER", "CHANNEL"],
            intents: [Intents.ALL],
            allowedMentions: {
                repliedUser: false
            },
            ws: {
                properties: {
                    $browser: "Discord Android"
                }
            }
        });

        this.database = new Database(this);
        this.logger = new Logger(null);
        this.commands = new CommandManager(this);
        this.utils = new ClientUtils(this);

        Util.hideProp(this, "config");
    }

    async loadEvents() {
        // Discord Events
        const DiscordEvent = await fs.readdir(this.config.EVENTS.DISCORD_EVENTS);

        for (const eventFile of DiscordEvent) {
            const EventDispatcher = (await import(`${this.config.EVENTS.DISCORD_EVENTS}/${eventFile}`).then((e) => e.default ?? e)) as typeof InternalEventDispatcher;
            const event = new EventDispatcher(this, eventFile.split(".").shift()! as keyof ClientEvents);

            this.on(event.name, (...args) => event.execute(...args));

            this.logger.success(`Loaded event ${event.name}`);
        }
    }

    async loadCommands() {
        const CommandsDir = await fs.readdir(this.config.COMMANDS_DIR);

        for (const commandCategory of CommandsDir) {
            const commands = await fs.readdir(`${this.config.COMMANDS_DIR}/${commandCategory}`);

            for (const command of commands) {
                const path = `${this.config.COMMANDS_DIR}/${commandCategory}/${command}`;
                const commandFile = (await import(path).then((x) => x.default ?? x)) as typeof CommandDispatcher;
                const commandDispatcher = new commandFile(this);

                // define additional props
                commandDispatcher.configure({
                    category: commandCategory,
                    location: path
                });

                this.commands.register(commandDispatcher.name, commandDispatcher);

                commandDispatcher.config.aliases!.forEach((alias) => this.commands.register(alias, commandDispatcher.name));

                this.logger.success(`Loaded command ${commandDispatcher.name}`);
            }
        }
    }

    async login(): Promise<string> {
        return await Promise.all([super.login(process.env.DISCORD_TOKEN), this.database.connect()]).then((pm) => pm[0]);
    }
}

export { Weeknd };

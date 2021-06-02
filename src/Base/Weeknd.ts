import { Client, Intents } from "discord.js";
import { Database } from "../Database/Database";

class Weeknd extends Client {
    database: Database;

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
    }

    async login() {
        return await Promise.all([
            super.login(process.env.DISCORD_TOKEN),
            this.database.connect()
        ]).then((pm) => pm[0]);
    }
}

export { Weeknd };

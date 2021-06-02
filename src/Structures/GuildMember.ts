import { Structures, Guild } from "discord.js";
import { Weeknd } from "../Base/Weeknd";

Structures.extend("GuildMember", (Extender) => {
    return class extends Extender {
        constructor(client: Weeknd, data: any, guild: Guild) {
            super(client, data, guild);
        }

        isDev() {
            return (this.user as any).isDev() as boolean;
        }
    };
});

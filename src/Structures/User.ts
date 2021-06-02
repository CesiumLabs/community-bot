import { Structures } from "discord.js";
import { Weeknd } from "../Base/Weeknd";

Structures.extend("User", (Extender) => {
    return class extends Extender {
        constructor(client: Weeknd, data: any) {
            super(client, data);
        }

        isDev() {
            return (this.client as Weeknd).config.DEVELOPERS.includes(this.id) || this.client.application?.owner?.id === this.id;
        }
    };
});

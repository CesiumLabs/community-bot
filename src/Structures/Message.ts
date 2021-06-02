import { Structures, DMChannel, TextChannel, NewsChannel } from "discord.js";
import { Weeknd } from "../Base/Weeknd";

Structures.extend("Message", (Extender) => {
    return class extends Extender {
        constructor(client: Weeknd, data: any, channel: DMChannel | TextChannel | NewsChannel) {
            super(client, data, channel);
        }

        async args(clean?: boolean) {
            const prefix = ((await (this.guild as any)!.prefix()) as string) ?? (this.client as Weeknd).config.DEFAULT_PREFIX;
            const content = clean ? this.cleanContent : this.content;
            const messageArguments = content.slice(prefix.length).trim().split(" ");
            const command = messageArguments.shift()!;

            return { commandName: command, args: messageArguments };
        }
    };
});

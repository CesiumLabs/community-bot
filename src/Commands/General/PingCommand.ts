import { Message } from "discord.js";
import { CommandDispatcher } from "../../Base/CommandDispatcher";
import { Weeknd } from "../../Base/Weeknd";
import { stripIndent } from "common-tags";

class PingCommand extends CommandDispatcher {
    constructor(client: Weeknd) {
        super(client);

        this.configure({
            name: "ping",
            aliases: ["pong"],
            description: "How fast is the bot huH?",
            private: false,
            permissions: []
        });
    }

    async execute(message: Message) {
        const msg = await message.channel.send("⏱ | Pinging...");
        await msg
            .edit(
                stripIndent`
        🏓 | Pong!
        > **Websocket Latency: \`${Math.round(this.client.ws.ping)}ms\`**
        > **REST: \`${msg.createdTimestamp - message.createdTimestamp}ms\`**
        `
            )
            .catch(() => {});
    }
}

export default PingCommand;

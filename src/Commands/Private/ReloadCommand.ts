import { Message } from "discord.js";
import { CommandDispatcher } from "../../Base/CommandDispatcher";
import { Weeknd } from "../../Base/Weeknd";

class ReloadCommand extends CommandDispatcher {
    constructor(client: Weeknd) {
        super(client);

        this.configure({
            name: "reload",
            aliases: ["reloadcmd", "reloadcommand"],
            description: "Re-loads a command",
            private: true,
            permissions: []
        });
    }

    async execute(message: Message, args: string[]) {
        let commandName = args[0];
        if (!commandName) {
            const response = await this.client.utils.prompt(message.channel, {
                message: "❓ Enter a command name to reload!",
                options: {
                    time: 15000,
                    max: 1,
                    dispose: true
                },
                filter: (m) => m.author.id === message.author.id,
                delete: false,
                all: false
            });

            commandName = response?.content!;
        }

        const success = this.client.commands.reload(commandName);

        return message.reply(`${success ? `✅ | Successfully reloaded **${commandName}** command` : "❌ | Reload failed"}!`);
    }
}

export default ReloadCommand;

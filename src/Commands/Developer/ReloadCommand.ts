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
        const commandName = args[0];
        const success = await this.client.commands.reload(commandName);
        
        return message.reply(`${success ? "✅" : "❌"} | Reload ${success ? "Successful" : "Failed"}!`);
    }
}

export default ReloadCommand;

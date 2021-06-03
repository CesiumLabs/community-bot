import { Message, Util } from "discord.js";
import { CommandDispatcher } from "../../Base/CommandDispatcher";
import { Weeknd } from "../../Base/Weeknd";

class SetPrefixCommand extends CommandDispatcher {
    constructor(client: Weeknd) {
        super(client);

        this.configure({
            name: "setprefix",
            aliases: [],
            description: "Set custom prefix for this server",
            private: false,
            permissions: ["MANAGE_GUILD"]
        });
    }

    async execute(message: Message, args: string[]) {
        const prefix = args.join(" ");
        if (!prefix) return message.reply(`✅ | Current prefix is **\`${Util.escapeMarkdown(await (message.guild as any).prefix())}\`**!`);
        if (prefix.length > 7) return message.reply("❌ | Prefix must be less than or equal to 7 characters!");
        if (prefix === (await (message.guild as any).prefix())) return message.reply(`❌ | Prefix is already set to **\`${Util.escapeMarkdown(prefix)}\`**!`);

        await this.client.database.models.get("Guild")!.findOneAndUpdate({ id: message.guild!.id }, { prefix: prefix === "reset" ? this.client.config.DEFAULT_PREFIX : prefix });
        const newPrefix = await (message.guild as any).prefix(true);

        message.channel.send(`✅ | Prefix set to **\`${Util.escapeMarkdown(newPrefix)}\`**`);
    }
}

export default SetPrefixCommand;

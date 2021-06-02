import { Message } from "discord.js";
import { EventDispatcher } from "../../Base/EventDispatcher";

class MessageEvent extends EventDispatcher {
    async execute(message: Message) {
        if (message.author.bot || !message.guild) return;
        await (message.guild as any).register();
        const prefix = (await (message.guild as any).prefix()) as string;
        if (message.content.indexOf(prefix) !== 0) return;

        const { commandName, args } = (await (message as any).args()) as { commandName: string; args: string[] };
        const command = this.client.commands.resolve(commandName);
        if (!command) return;

        if (command.config.private && !(message.author as any).isDev()) return message.reply(`❌ | Missing permissions: \`BOT_DEVELOPER\`!`);
        if (!(message.author as any).isDev() && !message.member?.permissions.has(command.config.permissions!))
            return message.reply(`❌ | Missing permissions: ${(command.config.permissions as string[])!.map((m: string) => `\`${m}\``).join(", ")}!`);

        try {
            await command.execute(message, args);
        } catch (e) {
            message.reply(`❌ | Could not execute command **${command.name}**!\n\`\`\`js\n${e}\`\`\``).catch(() => {});
        }
    }
}

export default MessageEvent;

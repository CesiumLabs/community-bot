import { Message } from "discord.js";
import { EventDispatcher } from "../../Base/EventDispatcher";
import { Collection } from "discord.js";

const cooldowns = new Collection<string, number>();

class MessageEvent extends EventDispatcher {
    async execute(message: Message) {
        if (message.author.bot || !message.guild) return;
        await (message.guild as any).register();
        const prefix = (await (message.guild as any).prefix()) as string;
        if (message.content.indexOf(prefix) !== 0) return;

        const { commandName, args } = (await (message as any).args()) as { commandName: string; args: string[] };
        const command = this.client.commands.resolve(commandName);
        if (!command) {
            const tagdb = this.client.database.models.get("Tags")!;
            const tag = await tagdb.findOne({ guild: message.guild!.id, id: commandName });
            if (!tag) return;
            return this.client.commands.resolve("tag")?.execute(message, [commandName]);
        }

        if (cooldowns.has(`${command.name}_${message.author.id}`) && command.config.cooldown! - (Date.now() - cooldowns.get(`${command.name}_${message.author.id}`)!) > 0) {
            return message.reply(
                `⛔ | Please wait for **${Math.ceil(
                    (command.config.cooldown! - (Date.now() - cooldowns.get(`${command.name}_${message.author.id}`)!)) / 1000
                )} second(s)** before using ${command.name}!`
            );
        }

        if (command.config.private && !(message.author as any).isDev()) return message.reply(`❌ | Missing permissions: \`BOT_DEVELOPER\`!`);
        if (!message.member?.permissions.has(command.config.permissions!))
            return message.reply(`❌ | Missing permissions: ${(command.config.permissions as string[])!.map((m: string) => `\`${m}\``).join(", ")}!`);

        try {
            await command.execute(message, args);
        } catch (e) {
            message.reply(`❌ | Could not execute command **${command.name}**!\n\`\`\`js\n${e}\`\`\``).catch(() => {});
        } finally {
            cooldowns.set(`${command.name}_${message.author.id}`, Date.now());
        }
    }
}

export default MessageEvent;

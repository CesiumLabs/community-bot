import { Message } from "discord.js";
import { CommandDispatcher } from "../../Base/CommandDispatcher";
import { Weeknd } from "../../Base/Weeknd";

class EvalCommand extends CommandDispatcher {
    constructor(client: Weeknd) {
        super(client);

        this.configure({
            name: "eval",
            aliases: ["ev"],
            description: "Evaluates arbitrary JavaScript",
            private: true,
            permissions: []
        });
    }

    async execute(message: Message, args: string[]) {
        let code = args.join(" ");
        if (!code) {
            const response = await this.client.utils.prompt(message.channel, {
                message: "❓ Write a code to eval",
                options: {
                    time: 60000,
                    idle: 60000,
                    max: 1,
                    dispose: true
                },
                all: false,
                filter: (m) => m.author.id === message.author.id,
                delete: false
            });

            code = response?.content!;
        }

        if (!code) return message.reply("❌ | Time's up, try again next time!");

        const flags = this.client.utils.commandFlags(code);
        const awaiter = flags.find((x) => "await" in x);
        if (awaiter) code = code.replace("--await", "").trim();

        try {
            const ev = this.client.utils.cleanText(awaiter ? await eval(code) : eval(code));

            return message.reply(ev, { code: "js", split: true });
        } catch (e) {
            return message.reply(`${e}`, { code: "js", split: true });
        }
    }
}

export default EvalCommand;

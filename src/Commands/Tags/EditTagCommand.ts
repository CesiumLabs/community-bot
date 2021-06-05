import { Message } from "discord.js";
import { CommandDispatcher } from "../../Base/CommandDispatcher";
import { Weeknd } from "../../Base/Weeknd";

class EditTagCommand extends CommandDispatcher {
    constructor(client: Weeknd) {
        super(client);

        this.configure({
            name: "edittag",
            aliases: ["updatetag"],
            description: "Update a tag",
            private: false,
            permissions: ["MANAGE_GUILD"],
            cooldown: 5000
        });
    }

    async execute(message: Message, args: string[]) {
        let tagName = args.shift(),
            tagContent = args.join(" ");

        if (!tagName) {
            const response = await this.client.utils.prompt(message.channel, {
                message: "✍ | Alright, enter your tag name. Write `cancel` to stop!",
                options: {
                    max: 1,
                    time: 20000,
                    dispose: true
                },
                all: false,
                filter: (m) => m.author.id === message.author.id
            });

            if (!response || !response.content || response.content.toLowerCase() === "cancel") return message.reply("❌ | Looks like we are not editing a tag, try again later!");
            tagName = response.content;
        }

        if (!tagContent) {
            const response = await this.client.utils.prompt(message.channel, {
                message: "✍ | Alright, now enter your new tag content in 2 minutes. You can cancel this anytime by sending `cancel`!",
                options: {
                    max: 1,
                    time: 120000,
                    dispose: true
                },
                all: false,
                filter: (m) => m.author.id === message.author.id
            });

            if (!response || !response.content || response.content.toLowerCase() === "cancel") return message.reply("❌ | Looks like we are not editing a tag, try again later!");

            tagContent = response.content;
        }

        tagName = tagName.toLowerCase();

        const tagdb = this.client.database.models.get("Tags")!;
        const tag = await tagdb.findOneAndUpdate({ guild: message.guild!.id, id: tagName }, { content: tagContent }).catch(() => {});
        if (!tag) return message.reply("❌ | Could not update that tag!");

        message.reply(`✅ | Updated tag **${tagName}**`);
    }
}

export default EditTagCommand;

import { Message } from "discord.js";
import { CommandDispatcher } from "../../Base/CommandDispatcher";
import { Weeknd } from "../../Base/Weeknd";

class ViewTagCommand extends CommandDispatcher {
    constructor(client: Weeknd) {
        super(client);

        this.configure({
            name: "viewtag",
            aliases: ["tag", "t"],
            description: "View a tag",
            private: false,
            permissions: [],
            cooldown: 5000
        });
    }

    async execute(message: Message, args: string[]) {
        let tagName = args.join(" ");

        if (!tagName) {
            const response = await this.client.utils.prompt(message.channel, {
                message: "✍ | Alright, enter your tag name!",
                options: {
                    max: 1,
                    time: 20000,
                    dispose: true
                },
                all: false,
                filter: (m) => m.author.id === message.author.id
            });

            if (!response || !response.content) return message.reply("❌ | Looks like we are not viewing a tag!");
            tagName = response.content;
        }

        tagName = tagName.toLowerCase();

        const tagdb = this.client.database.models.get("Tags")!;
        const tag = await tagdb.findOne({ guild: message.guild!.id, id: tagName });
        if (!tag) return message.reply("❌ | That tag is not available!");

        await tagdb.findOneAndUpdate({ guild: tag.guild, id: tag.id }, { $inc: { uses: 1 } }).catch(() => {});

        message.channel.send({ content: tag.content, split: true, allowedMentions: { parse: [] } });
    }
}

export default ViewTagCommand;

import { Message } from "discord.js";
import { CommandDispatcher } from "../../Base/CommandDispatcher";
import { Weeknd } from "../../Base/Weeknd";
import { stripIndent } from "common-tags";

class CreateTagCommand extends CommandDispatcher {
    constructor(client: Weeknd) {
        super(client);

        this.configure({
            name: "createtag",
            aliases: ["addtag", "newtag", "maketag"],
            description: "Creates a tag",
            private: false,
            permissions: ["MANAGE_GUILD"],
            cooldown: 5000
        });
    }

    async execute(message: Message, args: string[]) {
        let tagName = args.shift(), tagContent = args.join(" ");
        
        if (!tagName) {
            const response = await this.client.utils.prompt(message.channel, {
                message: "✍ | Alright, enter your tag name. Write `cancel` to stop!",
                options: {
                    max: 1,
                    time: 20000,
                    dispose: true
                },
                all: false,
                filter: m => m.author.id === message.author.id
            });

            if (!response || !response.content || response.content.toLowerCase() === "cancel") return message.reply("❌ | Looks like we are not creating a tag, try again later!");
            tagName = response.content;
        }

        if (!tagContent) {
            const response = await this.client.utils.prompt(message.channel, {
                message: "✍ | Alright, now enter your tag content in 2 minutes. You can cancel this anytime by sending `cancel`!",
                options: {
                    max: 1,
                    time: 120000,
                    dispose: true
                },
                all: false,
                filter: m => m.author.id === message.author.id
            });

            if (!response || !response.content || response.content.toLowerCase() === "cancel") return message.reply("❌ | Looks like we are not creating a tag, try again later!");
            
            tagContent = response.content;
        }

        tagName = tagName.toLowerCase();
        if (tagName.length > 20) return message.reply("❌ | Tag name length may not be more than 20 characters.");

        const tagdb = this.client.database.models.get("Tags")!;
        if (await tagdb.findOne({ guild: message.guild!.id, id: tagName })) return message.reply("❌ | That tag name is not available!");
        
        const newTag = new tagdb({
            id: tagName,
            uses: 0,
            author: message.author.id,
            createdTimestamp: new Date(),
            guild: message.guild!.id,
            content: stripIndent(tagContent)
        });

        await newTag.save();

        message.reply(`✅ | Created tag **${tagName}**!`);
    }
}

export default CreateTagCommand;

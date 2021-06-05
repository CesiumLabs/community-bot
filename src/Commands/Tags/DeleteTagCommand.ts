import { Message } from "discord.js";
import { CommandDispatcher } from "../../Base/CommandDispatcher";
import { Weeknd } from "../../Base/Weeknd";

class DeleteTagCommand extends CommandDispatcher {
    constructor(client: Weeknd) {
        super(client);

        this.configure({
            name: "deletetag",
            aliases: ["rmtag", "removetag"],
            description: "Delete a tag",
            private: false,
            permissions: ["MANAGE_GUILD"],
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
                filter: m => m.author.id === message.author.id
            });

            if (!response || !response.content) return message.reply("❌ | Looks like we are not deleting a tag!");
            tagName = response.content;
        }

        tagName = tagName.toLowerCase();

        const tagdb = this.client.database.models.get("Tags")!;
        const tag = await tagdb.findOneAndDelete({ guild: message.guild!.id, id: tagName }).catch(() => {});
        if (!tag) return message.reply("❌ | Could not delete that tag!");

        message.reply(`✅ | Removed tag **${tagName}**`);
    }
}

export default DeleteTagCommand;

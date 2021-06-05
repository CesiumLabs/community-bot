import { Message, MessageEmbed } from "discord.js";
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
                filter: (m) => m.author.id === message.author.id
            });

            if (!response || !response.content) return message.reply("❌ | Looks like we are not deleting a tag!");
            tagName = response.content;
        }

        tagName = tagName.toLowerCase();

        const embed = new MessageEmbed()
            .setTitle(`Do you really want to delete tag ${tagName}?`)
            .setColor("YELLOW")
            .setFooter("You have 15 seconds to confirm.")
            .setDescription("You can't undo this process.\n\n✅ Yes | ❌ No");
        
        const confirm = await this.client.utils.confirmReaction({
            message: embed,
            channel: message.channel,
            options: {
                time: 15000
            },
            filter: (_, user) => user.id === message.author.id
        }).catch(() => {});

        if (!confirm) return message.reply("❌ | Cancelled!");

        const tagdb = this.client.database.models.get("Tags")!;
        const tag = await tagdb.findOneAndDelete({ guild: message.guild!.id, id: tagName }).catch(() => {});
        if (!tag) return message.reply("❌ | Could not delete that tag!");

        message.reply(`✅ | Removed tag **${tagName}**`);
    }
}

export default DeleteTagCommand;

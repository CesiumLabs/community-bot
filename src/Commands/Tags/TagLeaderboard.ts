import { Message, MessageEmbed } from "discord.js";
import { CommandDispatcher } from "../../Base/CommandDispatcher";
import { Weeknd } from "../../Base/Weeknd";
import { chunk } from "lodash";

class TagLeaderboard extends CommandDispatcher {
    constructor(client: Weeknd) {
        super(client);

        this.configure({
            name: "taglb",
            aliases: ["tagleaderboard", "tlb", "tags"],
            description: "View tag leaderboard",
            private: false,
            permissions: [],
            cooldown: 5000
        });
    }

    async execute(message: Message, args: string[]) {
        const user = args.length ? this.client.utils.resolveUser(args.join(" ")) : null;
        const tagdb = this.client.database.models.get("Tags")!;
        const tags = await (user ? tagdb.find({ guild: message.guild!.id, author: user.id }) : tagdb.find({ guild: message.guild!.id }));
        if (!tags || !tags.length) return message.reply("❌ | Leaderboard is not available!");

        const pages: MessageEmbed[] = [];

        chunk(tags, 10).forEach((tag: any[]) => {
            pages.push(
                new MessageEmbed()
                    .setAuthor(message.guild!.name, message.guild!.iconURL()!)
                    .setTitle("Tags Leaderboard")
                    .setDescription(tag.map((m: any, i: number) => `**${i + 1}.** ${m.id} - ${m.uses.toLocaleString()} uses`).join("\n"))
                    .setColor("RANDOM")
                    .setTimestamp()
            );
        });

        if (pages.length > 1) {
            return this.client.utils.paginateEmbed({
                pages,
                filter: (_, user) => user.id === message.author!.id,
                timeout: 30000,
                channel: message.channel
            });
        }

        return message.channel.send({
            embeds: [pages[0].setFooter(`Page ${pages.length} of ${pages.length}`)]
        });
    }
}

export default TagLeaderboard;

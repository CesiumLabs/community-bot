import { Message, MessageEmbed } from "discord.js";
import { CommandDispatcher } from "../../Base/CommandDispatcher";
import { Weeknd } from "../../Base/Weeknd";

class TagInfoCommand extends CommandDispatcher {
    constructor(client: Weeknd) {
        super(client);

        this.configure({
            name: "taginfo",
            aliases: ["tinfo", "ti"],
            description: "Tag information",
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

        const embed = new MessageEmbed()
            .setAuthor("Tag Information", message.guild!.iconURL()!)
            .setTitle(tag.id)
            .setDescription((tag.content as string).substr(0, 2048))
            .addField("\u200b", "\u200b")
            .addField("Created by", `${this.client.users.cache.get(tag.author)?.tag ?? `<@!${tag.author}>`}`, true)
            .addField("Created at", tag.createdTimestamp.toUTCString(), true)
            .addField("Owned by", `${this.client.guilds.cache.get(tag.guild)?.name ?? tag.guild}`, true)
            .setFooter(`This tag was used ${tag.uses.toLocaleString()} ${tag.uses === 1 ? "time" : "times"}!`, message.author.displayAvatarURL())
            .setTimestamp()
            .setColor("RANDOM");

        message.reply({ embeds: [embed] });
    }
}

export default TagInfoCommand;

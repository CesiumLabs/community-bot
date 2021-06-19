import { Message, MessageEmbed, AllowedImageFormat } from "discord.js";
import { CommandDispatcher } from "../../Base/CommandDispatcher";
import { Weeknd } from "../../Base/Weeknd";

class AvatarCommand extends CommandDispatcher {
    constructor(client: Weeknd) {
        super(client);

        this.configure({
            name: "avatar",
            aliases: ["av"],
            description: "Grab user avatar",
            private: false,
            permissions: []
        });
    }

    async execute(message: Message, args: string[]) {
        const user = message.mentions.users.first() ?? (this.client.utils.resolveMember(message.guild!, args.join(" ") || message.author) ?? message.member!).user;
        const avatars = [
            {
                format: "Default",
                avatar: user.defaultAvatarURL
            }
        ];

        for (const format of ["webp", "png", "gif", "jpeg"]) {
            if (user.avatar) {
                avatars.push({
                    format: format,
                    avatar: format === "gif" && !user.avatar.startsWith("a_") ? "" : user.displayAvatarURL({ size: 1024, format: format as AllowedImageFormat })
                });
            } else {
                break;
            }
        }

        const embed = new MessageEmbed()
            .setAuthor(user.tag, user.displayAvatarURL())
            .setTitle("User Avatar")
            .setDescription(avatars.map((m) => `**[${m.format.toUpperCase()}](${m.avatar})**`).join(" | "))
            .setColor(message.member?.displayHexColor ?? "RANDOM")
            .setImage(user.displayAvatarURL({ size: 2048 }))
            .setThumbnail(avatars[0].avatar)
            .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp();

        return message.reply({
            embeds: [embed]
        });
    }
}

export default AvatarCommand;

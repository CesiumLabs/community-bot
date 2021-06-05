import { Message } from "discord.js";
import { CommandDispatcher } from "../../Base/CommandDispatcher";
import { Weeknd } from "../../Base/Weeknd";
import { DiscordComponents, MessageActionRow, MessageButton, fragment } from "../../utils/DiscordComponents";

class GitHubRepo extends CommandDispatcher {
    constructor(client: Weeknd) {
        super(client);

        this.configure({
            name: "githubrepo",
            aliases: ["repo", "sourcecode"],
            description: "My source code, what else?",
            private: true,
            permissions: [],
            cooldown: 5000
        });
    }

    async execute(message: Message) {
        const data = (
            <>
                <MessageActionRow>
                    <MessageButton
                        style="LINK"
                        disabled={false}
                        label="GitHub"
                        emoji={{
                            name: "GitHub",
                            id: "706736677753847849",
                            animated: false
                        }}
                        url="https://github.com/DevSnowflake/community-bot"
                    />
                </MessageActionRow>
            </>
        );

        message.channel.send("Here's a cookie 🍪", { components: data });
    }
}

export default GitHubRepo;

import { Message, MessageEmbed } from "discord.js";
import { CommandDispatcher } from "../../Base/CommandDispatcher";
import { Weeknd } from "../../Base/Weeknd";

class LighthouseCommand extends CommandDispatcher {
    constructor(client: Weeknd) {
        super(client);

        this.configure({
            name: "lighthouse",
            aliases: ["lh", "webaudit"],
            description: "Audit your website",
            private: false,
            permissions: [],
            cooldown: 10000
        });
    }

    async execute(message: Message, args: string[]) {
        let website = args.join(" ");
        if (!website) {
            const response = await this.client.utils.prompt(message.channel, {
                all: false,
                delete: true,
                message: "⏱ | Enter your website url",
                options: {
                    time: 20000,
                    dispose: true,
                    max: 1
                },
                filter: (m) => m.author.id === message.author.id
            });

            if (!response || !response.content) return message.reply("❌ | Try again later!");

            website = response.content;
        }

        if (!this.buildURL(website)) return message.reply("❌ | Invalid url");

        message.react("⏱").catch(() => {});

        fetch("https://lighthouse-dot-webdotdevsite.appspot.com//lh/newaudit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: website,
                replace: true,
                save: false
            })
        })
            .then((res) => {
                if (res.status !== 201) throw new Error("Audit Error");
                return res.json();
            })
            .then((data) => {
                if (!data || !data.lhrSlim) return message.reply("❌ | Could not Audit");

                const lhdata = {
                    perf: this.calculate(data.lhrSlim.find((x: any) => x.id === "performance").score),
                    acc: this.calculate(data.lhrSlim.find((x: any) => x.id === "accessibility").score),
                    bp: this.calculate(data.lhrSlim.find((x: any) => x.id === "best-practices").score),
                    seo: this.calculate(data.lhrSlim.find((x: any) => x.id === "seo").score)
                };

                const score = (m: number) => (m < 50 ? "🟥" : m > 49 && m < 90 ? "🟨" : "🟩");
                const sc = Object.values(lhdata).filter((x) => x < 49).length;

                const embed = new MessageEmbed()
                    .setAuthor("Lighthouse Audit Report", message.guild?.iconURL()!, data.lhr.finalUrl)
                    .addField("Performance", `${score(lhdata.perf)} **${lhdata.perf}**`)
                    .addField("Accessibility", `${score(lhdata.acc)} **${lhdata.acc}**`)
                    .addField("Best Practices", `${score(lhdata.bp)} **${lhdata.bp}**`)
                    .addField("SEO", `${score(lhdata.seo)} **${lhdata.seo}**`)
                    .setFooter(`Took ${Math.floor((Date.now() - message.createdTimestamp) / 1000)} seconds`)
                    .setColor(sc > 2 ? "RED" : sc === 0 ? "GREEN" : "YELLOW");

                message.reply({
                    embeds: [embed]
                });
            })
            .catch(() => {
                message.reply("❌ | Could not Audit");
            })
            .finally(() => {
                message.reactions.removeAll().catch(() => {});
            });
    }

    calculate(n: number) {
        return Math.floor(n * 100 || 0);
    }

    buildURL(src: string) {
        try {
            const url = new URL(src);
            if (!url || !url.origin || !url.hostname || !url.host) return null;
            return url.toString();
        } catch {
            return null;
        }
    }
}

export default LighthouseCommand;

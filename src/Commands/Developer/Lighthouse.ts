import { createCanvas } from "canvas";
import { Message, MessageAttachment, MessageEmbed } from "discord.js";
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
                const attachment = this.makeCanvas(lhdata.perf, lhdata.acc, lhdata.bp, lhdata.seo);
                message.reply({
                    files: [{ attachment, name: "lighthouse.png" }]
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
    makeCanvas(perf: number, acc: number, bp: number, seo: number) {
        const canvas = createCanvas(800, 400);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let pfColors = this.getColors(perf);
        this.drawCircle(100, 180, 60, (perf / 100) * 1.5, pfColors[0], pfColors[1], ctx);
        this.writeTextInsideCircle(100, 180, perf.toString(), pfColors[0], ctx);

        const accColors = this.getColors(acc);
        this.drawCircle(300, 180, 60, (acc / 100) * 1.5, accColors[0], accColors[1], ctx);
        this.writeTextInsideCircle(300, 180, acc.toString(), accColors[0], ctx);

        const bpColors = this.getColors(bp);
        this.drawCircle(500, 180, 60, (bp / 100) * 1.5, bpColors[0], bpColors[1], ctx);
        this.writeTextInsideCircle(500, 180, bp.toString(), bpColors[0], ctx);

        const seoColors = this.getColors(seo);
        this.drawCircle(700, 180, 60, (seo / 100) * 1.5, seoColors[0], seoColors[1], ctx);
        this.writeTextInsideCircle(700, 180, seo.toString(), seoColors[0], ctx);

        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText("Performance", 43, 280);
        ctx.fillText("Accessibility", 250, 280);
        ctx.fillText("Best Practices", 440, 280);
        ctx.fillText("SEO", 680, 280);

        return canvas.toBuffer();
    }
    getColors(i: number) {
        if (i >= 0 && i <= 49) return ["red", "#fad7d7"];
        else if (i >= 50 && i <= 89) return ["#fb8c00", "#ffe8cc"];
        else if (i >= 90) return ["#18b663", "#d1f1e0"];
        return ["red", "#fad7d7"];
    }
    drawCircle(x: number, y: number, rad: number, eAngle: number, borderColor: string, lightBorderColor: string, ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, 2 * Math.PI);
        ctx.lineWidth = 8;
        ctx.fillStyle = lightBorderColor;
        ctx.strokeStyle = lightBorderColor;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(x, y, rad, -(Math.PI / 2), eAngle * Math.PI);
        ctx.strokeStyle = borderColor;
        ctx.stroke();
        ctx.closePath();
    }
    writeTextInsideCircle(x: number, y: number, text: string, color: string, ctx: CanvasRenderingContext2D) {
        ctx.font = "bold 30px sans-serif";
        ctx.fillStyle = color;
        if (text.length == 3) return ctx.fillText(text, x - 28, y + 12);
        ctx.fillText(text, x - 18, y + 12);
    }
}

export default LighthouseCommand;

import { Util } from "../utils/Util";
import { Weeknd } from "./Weeknd";
import {
    UserResolvable,
    User,
    Guild,
    GuildMember,
    TextChannel,
    Message,
    CollectorFilter,
    MessageOptions,
    Collection,
    DMChannel,
    NewsChannel,
    MessageCollectorOptions,
    MessageEmbed,
    MessageReaction,
    ReactionCollectorOptions,
    MessageComponentInteractionCollectorOptions,
    MessageComponentInteraction
} from "discord.js";
import utils from "util";
import { DiscordComponents, fragment, MessageActionRow, MessageButton } from "discord.js-jsx-components";

interface Prompt {
    message: string | (MessageOptions & { split: false });
    filter?: CollectorFilter<[Message]>;
    options?: MessageCollectorOptions;
    delete?: boolean;
    all?: boolean;
}

interface PaginateOptions {
    timeout?: number;
    channel: TextChannel | DMChannel | NewsChannel;
    backEmoji?: string;
    forwardEmoji?: string;
    pages: MessageEmbed[];
    filter?: CollectorFilter<[MessageReaction, User]>;
}

interface ReactionConfirmOptions {
    message: string | (MessageOptions & { split: false });
    filter?: CollectorFilter<[MessageReaction, User]>;
    options?: ReactionCollectorOptions;
    delete?: boolean;
    confirmEmoji?: string;
    cancelEmoji?: string;
    channel: TextChannel | DMChannel | NewsChannel;
}

interface ButtonConfirmOptions {
    message: MessageOptions;
    filter?: CollectorFilter<[MessageComponentInteraction]>;
    options?: MessageComponentInteractionCollectorOptions;
    delete?: boolean;
    channel: TextChannel | DMChannel | NewsChannel;
    acceptID: string;
    declineID: string;
}

class ClientUtils {
    client: Weeknd;

    constructor(client: Weeknd) {
        this.client = client;

        Util.hideProp(this, "client");
    }

    resolveUser(query: UserResolvable | string, multi?: false): User;
    resolveUser(query: UserResolvable | string, multi?: true): User[];
    resolveUser(query: UserResolvable | string, multi = false): User | User[] | undefined {
        const couldResolve = this.client.users.resolve(query as any);
        if (couldResolve) return multi ? [couldResolve] : couldResolve;

        try {
            const name = (query as string).toLowerCase();
            const arr: User[] = [];

            for (const [_, user] of this.client.users.cache) {
                if (!(user.username.toLowerCase().indexOf(name) < 0)) arr.push(user);
                if (!multi && arr.length > 0) break;
            }

            return multi ? arr : arr[0];
        } catch {}
    }

    resolveMember(guild: Guild, query: UserResolvable | string, multi?: false): GuildMember;
    resolveMember(guild: Guild, query: UserResolvable | string, multi?: true): GuildMember[];
    resolveMember(guild: Guild, query: UserResolvable | string, multi = false): GuildMember | GuildMember[] | undefined {
        const couldResolve = guild.members.resolve(query as any);
        if (couldResolve) return multi ? [couldResolve] : couldResolve;

        try {
            const name = (query as string).toLowerCase();
            const arr: GuildMember[] = [];

            for (const [_, member] of guild.members.cache) {
                if (!(member.user.username.toLowerCase().indexOf(name) < 0) || !((member.nickname ?? "").toLowerCase().indexOf(name) < 0)) arr.push(member);
                if (!multi && arr.length > 0) break;
            }

            return multi ? arr : arr[0];
        } catch {}
    }

    prompt(channel: TextChannel | DMChannel | NewsChannel, options: Prompt & { all: true }): Promise<Collection<`${bigint}`, Message> | undefined>;
    prompt(channel: TextChannel | DMChannel | NewsChannel, options: Prompt & { all: false }): Promise<Message | undefined>;
    prompt(channel: TextChannel | DMChannel | NewsChannel, options: Prompt): Promise<(Message | undefined) | (Collection<`${bigint}`, Message> | undefined)> {
        return new Promise(async (resolve) => {
            if (!options.filter) options.filter = () => true;
            const msg = await channel.send(options.message);
            const collector = channel.createMessageCollector(options.filter, options.options);

            collector.on("end", (collected: Collection<`${bigint}`, Message>, reason: string) => {
                if (options.delete && msg.deletable) msg.delete();
                resolve(options.all ? collected : collected.first()!);
            });
        });
    }

    commandFlags(args: string[] | string) {
        if (!Array.isArray(args)) args = args.split(" ");
        const regex = /--([\wа-я]+)(\s([\wа-я]+))?/gi;

        return (args.join(" ")!.match(regex) ?? []).map((el: string) => {
            const [tag, val] = el.slice(2).split(" ");
            return { [tag]: val ?? null };
        });
    }

    cleanText(text: string | any) {
        if (typeof text !== "string") text = utils.inspect(text, { depth: 1 });

        text = text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/, "@" + String.fromCharCode(8203))
            .replace(new RegExp(this.client.token!, "g") ?? "", "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

        return text;
    }

    async paginateEmbed(options: PaginateOptions) {
        if (!options.timeout) options.timeout = 60000;
        if (!options.backEmoji) options.backEmoji = "⬅";
        if (!options.forwardEmoji) options.forwardEmoji = "➡";
        if (!options.filter) options.filter = () => true;

        let currentPage = 0;
        const cpm = await options.channel.send({
            embeds: [options.pages[currentPage].setFooter(`Page ${currentPage + 1} of ${options.pages.length}`)]
        });
        for (const emoji of [options.backEmoji, options.forwardEmoji]) {
            if (!(await cpm.react(emoji).catch(() => {}))) return cpm;
        }

        const collector = cpm.createReactionCollector(options.filter, { time: options.timeout });

        collector.on("collect", (reaction, user) => {
            if (![options.backEmoji, options.forwardEmoji].includes(reaction.emoji.name! ?? reaction.emoji.id ?? reaction.emoji)) return;

            reaction.users.remove(user).catch(() => {});

            switch (reaction.emoji.name) {
                case options.backEmoji:
                    currentPage = currentPage > 0 ? --currentPage : options.pages.length - 1;
                    break;
                case options.forwardEmoji:
                    currentPage = currentPage + 1 < options.pages.length ? ++currentPage : 0;
                    break;
            }

            cpm.edit({
                embeds: [options.pages[currentPage].setFooter(`Page ${currentPage + 1} of ${options.pages.length}`)]
            });
        });

        collector.on("end", () => {
            if (!cpm.deleted) cpm.reactions.removeAll().catch(() => {});
        });

        return cpm;
    }

    confirmReaction(options: ReactionConfirmOptions): Promise<boolean> {
        return new Promise(async (resolve) => {
            if (!options.cancelEmoji) options.cancelEmoji = "❌";
            if (!options.confirmEmoji) options.confirmEmoji = "✅";
            options.options = Object.assign({}, { time: 20000, max: 1 } as ReactionCollectorOptions, options.options);
            if (!options.filter) options.filter = () => true;

            const msg = await options.channel.send(options.message);
            for (const emoji of [options.confirmEmoji, options.cancelEmoji]) await msg.react(emoji).catch(() => {});

            const collector = msg.createReactionCollector(options.filter, options.options);

            collector.once("collect", async (reaction, user) => {
                if (![options.cancelEmoji, options.confirmEmoji].includes(reaction.emoji.name! ?? reaction.emoji.id ?? reaction.emoji)) return;
                reaction.users.remove(user).catch(() => {});

                switch (reaction.emoji.name) {
                    case options.cancelEmoji:
                        if (msg.deletable) {
                            await msg.delete().catch(() => {});
                            resolve(false);
                        }
                        break;
                    case options.confirmEmoji:
                        if (msg.deletable) {
                            await msg.delete().catch(() => {});
                            resolve(true);
                        }
                        break;
                }

                try {
                    collector.stop();
                } catch {}
            });

            collector.on("end", (_, reason) => {
                if (reason.includes("time")) resolve(false);
            });
        });
    }

    // @todo: fix this
    comfirmButton(options: ButtonConfirmOptions) {
        return new Promise<{accepted: boolean, interaction: MessageComponentInteraction }>(async (resolve) => {
            if (!options.filter) options.filter = () => true;
            options.options = Object.assign({}, ({
                time: 15000,
                dispose: false
            } as MessageComponentInteractionCollectorOptions), options.options);

            const data = (
                <>
                    <MessageActionRow>
                        <MessageButton style="DANGER" label="Confirm" customID={options.acceptID} />
                        <MessageButton style="PRIMARY" label="Cancel" customID={options.declineID} />
                    </MessageActionRow>
                </>
            );
            
            const msg = await (options.channel as any).send({ ...options.message, components: data }) as Message;

            const collector = options.channel.createMessageComponentInteractionCollector(options.filter, options.options);

            collector.on("collect", (interaction) => {
                const accepted = interaction.customID === options.acceptID;
                if (options.delete && msg.deletable) msg.delete();
                
                resolve({ accepted, interaction });
            });

            collector.on("end", (collected) => {                
                resolve({
                    accepted: collected.first()?.customID === options.acceptID,
                    interaction: collected.first()!
                });
            })
        });
    }
}

export { ClientUtils };

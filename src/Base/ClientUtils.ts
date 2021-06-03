import { Util } from "../utils/Util";
import { Weeknd } from "./Weeknd";
import { UserResolvable, User, Guild, GuildMember } from "discord.js";

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
}

export { ClientUtils };

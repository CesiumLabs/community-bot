import { Util } from "../utils/Util";
import { Weeknd } from "./Weeknd";
import { UserResolvable, User } from "discord.js";

class ClientUtils {
    client: Weeknd;

    constructor(client: Weeknd) {
        this.client = client;

        Util.hideProp(this, "client");
    }

    resolveUser(query: UserResolvable, multi: true): User[];
    resolveUser(query: UserResolvable, multi: false): User;
    resolveUser(query: UserResolvable, multi: boolean = false): User | User[] | undefined {
        const couldResolve = this.client.users.resolve(query);
        if (couldResolve) return multi ? [couldResolve] : couldResolve;

        try {
            const name = (query as string).toLowerCase();
            const arr: User[] = [];

            for (const [_, user] of this.client.users.cache) {
                if (!(user.username.toLowerCase().indexOf(name) < 0)) arr.push(user);
                if (!multi) break;
            }

            return multi ? arr : arr[0];
        } catch {}
    }
}

export { ClientUtils };

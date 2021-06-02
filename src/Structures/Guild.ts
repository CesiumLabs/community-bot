import { Structures } from "discord.js";
import { Weeknd } from "../Base/Weeknd";
import { CacheStorage } from "../Database/CacheStorage";

Structures.extend("Guild", (Extender) => {
    return class extends Extender {
        store: CacheStorage<any>;

        constructor(client: Weeknd, data: any) {
            super(client, data);

            this.store = new CacheStorage();
        }

        async prefix(force: boolean = false): Promise<string> {
            if (!force && typeof this.store.get(this.id)?.prefix === "string") return this.store.get(this.id)?.prefix as string;
            const data = await (this.client as Weeknd).database.models.get("Guild")?.findOne({ id: this.id });
            const prefix = data?.prefix ?? (this.client as Weeknd).config.DEFAULT_PREFIX;
            this.store.set(this.id, data);
            return prefix;
        }

        async register() {
            const model = (this.client as Weeknd).database.models.get("Guild")!;
            const existing = await model.findOne({ id: this.id });

            if (existing) return existing;

            const doc = new model({
                id: this.id
            });

            await doc.save();

            return doc;
        }
    };
});

import { Structures } from "discord.js";
import { Weeknd } from "../Base/Weeknd";

Structures.extend("Guild", (Extender) => {
    return class extends Extender {
        constructor(client: Weeknd, data: any) {
            super(client, data);
        }

        async prefix(): Promise<string> {
            const data = await (this.client as Weeknd).database.models.get("Guild")?.findOne({ id: this.id });
            return data?.prefix ?? (this.client as Weeknd).config.DEFAULT_PREFIX;
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

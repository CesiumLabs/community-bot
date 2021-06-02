import { connect, connection, Connection, disconnect, Model } from "mongoose";
import { EventEmitter } from "events";
import { ActionLogModel, GuildModel, TagsModel, XpModel, StarboardModel } from "./models/index";
import { Weeknd } from "../Base/Weeknd";
import { Util } from "../utils/Util";
import { Collection } from "discord.js";

class Database extends EventEmitter {
    connection!: Connection;
    models = new Collection<string, Model<any, any, any>>();
    client: Weeknd;

    constructor(client: Weeknd) {
        super();
        this.client = client;

        // set models
        this.models.set(ActionLogModel.name, ActionLogModel.collection);
        this.models.set(GuildModel.name, GuildModel.collection);
        this.models.set(TagsModel.name, TagsModel.collection);
        this.models.set(XpModel.name, XpModel.collection);
        this.models.set(StarboardModel.name, StarboardModel.collection);

        this.connection.on("open", this.emit.bind(this, "ready"));

        Util.hideProp(this, "client");
    }

    connect() {
        this.connection = connection;

        return connect(process.env.MONGODB_URL!, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    get state() {
        switch (this.connection.readyState) {
            case 1:
                return "connected";
            case 2:
                return "connecting";
            case 3:
                return "disconnecting";
            default:
                return "disconnected";
        }
    }

    get ready() {
        return this.state === "connected";
    }

    destroy() {
        return new Promise<void>((resolve, reject) => {
            if (!["disconnected", "disconnecting"].includes(this.state)) return resolve(disconnect(reject));
            resolve();
        });
    }
}

export default Database;
export { Database };

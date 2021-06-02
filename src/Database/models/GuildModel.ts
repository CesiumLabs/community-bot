import { model, Schema, SchemaTypes } from "mongoose";
import { Config } from "../../../config";

const GuildModel = new Schema({
    id: {
        // guild id
        type: SchemaTypes.String,
        required: true
    },
    prefix: {
        // command prefix
        type: SchemaTypes.String,
        required: false,
        default: Config.DEFAULT_PREFIX
    },
    logChannel: {
        // logs channel id
        type: SchemaTypes.String,
        required: false
    },
    greetingsChannel: {
        // greetings channel id
        type: SchemaTypes.String,
        required: false
    },
    modLogChannel: {
        // mog log channel id
        type: SchemaTypes.String,
        required: false
    },
    starsChannel: {
        // starboard channel id
        type: SchemaTypes.String,
        required: false
    }
});

const Model = {
    collection: model("Guild", GuildModel),
    name: "ActionLog"
};

export default Model;

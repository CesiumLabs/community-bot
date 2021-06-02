import { model, Schema, SchemaTypes } from "mongoose";

const XpModel = new Schema({
    id: {
        // user id
        type: SchemaTypes.String,
        required: true
    },
    guild: {
        // guild id
        type: SchemaTypes.String,
        required: true
    },
    level: {
        // level
        type: SchemaTypes.Number,
        required: true,
        default: 0
    },
    xp: {
        // xp
        type: SchemaTypes.Number,
        required: true,
        default: 0
    }
});

const Model = {
    collection: model("UserXP", XpModel),
    name: "UserXP"
};

export default Model;

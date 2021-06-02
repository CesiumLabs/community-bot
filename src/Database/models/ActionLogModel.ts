import { model, Schema, SchemaTypes } from "mongoose";

const ActionLogModel = new Schema({
    id: {
        // case id
        type: SchemaTypes.Number,
        required: true
    },
    moderator: {
        // moderator id
        type: SchemaTypes.String,
        required: true
    },
    message: {
        // message id
        type: SchemaTypes.String,
        required: true
    },
    createdTimestamp: {
        // action created timestamp
        type: SchemaTypes.Date,
        required: true
    },
    guild: {
        // guild id
        type: SchemaTypes.String,
        required: true
    },
    reason: {
        // action reason
        type: SchemaTypes.String,
        required: true,
        default: "No reason provided"
    },
    duration: {
        // action duration, ex: for mute cases
        type: SchemaTypes.Number, // time in ms
        required: false,
        default: 0 // 0 = unlimited
    }
});

const Model = {
    collection: model("ActionLog", ActionLogModel),
    name: "ActionLog"
};

export default Model;

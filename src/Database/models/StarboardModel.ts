import { model, Schema, SchemaTypes } from "mongoose";

const StarboardModel = new Schema({
    id: {
        // starboard message id
        type: SchemaTypes.String,
        required: true
    },
    starCount: {
        // stars count
        type: SchemaTypes.Number,
        required: true,
        default: 0
    },
    author: {
        // message author id
        type: SchemaTypes.String,
        required: true
    },
    channel: {
        // message channel id
        type: SchemaTypes.String,
        required: true
    },
    guild: {
        // guild id
        type: SchemaTypes.String,
        required: true
    },
    message: {
        // original message id
        type: SchemaTypes.String,
        required: true
    }
});

const Model = {
    collection: model("Starboard", StarboardModel),
    name: "Starboard"
};

export default Model;

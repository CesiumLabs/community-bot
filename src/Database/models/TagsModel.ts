import { model, Schema, SchemaTypes } from "mongoose";

const TagsModel = new Schema({
    id: { // tag id, example tagName
        type: SchemaTypes.String,
        required: true
    },
    uses: { // Number of times this tag was used
        type: SchemaTypes.Number,
        required: true,
        default: 0
    },
    author: { // Tag author id
        type: SchemaTypes.String,
        required: true
    },
    createdTimestamp: { // Tag created timestamp
        type: SchemaTypes.Date,
        required: true
    },
    guild: { // The guild id who owns this tag. If none, this tag will be global
        type: SchemaTypes.String,
        required: false // global tag if no guild id
    }
});

const Model = {
    collection: model("Tags", TagsModel),
    name: "Tags"
};

export default Model;
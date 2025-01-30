import { Schema, model } from 'mongoose';

const CollectionSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        boards: [{
            type: Schema.Types.ObjectId,
            ref: 'Board',
        }],
    },
    { timestamps: true }
);

export default model('Collection', CollectionSchema);

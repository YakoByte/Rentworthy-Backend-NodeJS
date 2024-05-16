import mongoose, { Schema, Document, Types } from "mongoose";

interface IHistory extends Document {
    userId: Types.ObjectId;
    log: Array<{
        objectId: Types.ObjectId;
        action: string;
        data: object;
        date: string;
        time: Date;
    }>;
}

const historySchema: Schema = new Schema<IHistory>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        log: [
            {
                objectId: mongoose.Schema.Types.ObjectId,
                action: String,
                data: Object,
                date: String,
                time: Date,
            },
        ],
    },
    { timestamps: true }
);

historySchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // 1 month

const History = mongoose.model<IHistory>("History", historySchema);

export default History;
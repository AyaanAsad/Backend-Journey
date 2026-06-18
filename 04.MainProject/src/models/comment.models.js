import mongo from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new mongo.Schema(
    {
        content: {
            type: String,
            required: true
        },
        video: {
            type: mongo.Schema.Types.ObjectId,
            ref: "Video"
        },
        owner: {
            type: mongo.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)


commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongo.model("Comment", commentSchema)
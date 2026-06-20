import mongo from "mongoose";
import mongooseAgggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new mongo.Schema(
    {
        videoFile: {
            type: String, //cloudinary url
            required: true
        },
        thumbnail: {
            type: String, //cloudinary url
            required: true
        },
        title: {
            type: String, 
            required: true
        },
        description: {
            type: String, 
            required: true
        },
        duration: {
            type: Number, 
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
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

videoSchema.plugin(mongooseAgggregatePaginate)
export const Video = mongo.model("Video", videoSchema)
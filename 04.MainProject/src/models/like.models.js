import mongo from "mongoose";


const likeSchema = new mongo.Schema({
    video: {
        type: mongo.Schema.Types.ObjectId,
        ref: "Video"
    },
    comment: {
        type: mongo.Schema.Types.ObjectId,
        ref: "Comment"
    },
    tweet: {
        type: mongo.Schema.Types.ObjectId,
        ref: "Tweet"
    },
    likedBy: {
        type: mongo.Schema.Types.ObjectId,
        ref: "User"
    },
    
}, {timestamps: true})

export const Like = mongo.model("Like", likeSchema)
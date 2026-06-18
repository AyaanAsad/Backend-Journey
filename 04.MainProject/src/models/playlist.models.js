import mongo from "mongoose";

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videos: [
        {
            type: mongo.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    owner: {
        type: mongo.Schema.Types.ObjectId,
        ref: "User"
    },
}, {timestamps: true})



export const Playlist = mongo.model("Playlist", playlistSchema)
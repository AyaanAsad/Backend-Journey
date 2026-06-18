import mongo from "mongoose";

const tweetSchema = new mongo.Schema({
    content: {
        type: String,
        required: true
    },
    owner: {
        type: mongo.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})


export const Tweet = mongo.model("Tweet", tweetSchema)
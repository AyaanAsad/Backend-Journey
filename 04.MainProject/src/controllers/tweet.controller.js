import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {User} from "../models/user.models.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    if(!content){
        throw new apiError(400,"Tweet cannot be empty")
    }
    
    const user = req.user?._id

    if(!user){
        throw new apiError(401,"you need to be logged in to tweet")
    }

    const tweet = await Tweet.create({
        content,
        owner:user
    })

    res.status(200).json(new apiResponse(200,tweet,"Tweet created successfully"))

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.params.userId
    if(!userId){
        throw new apiError(400,"Invalid user ID")
    }
    const allTweets = await Tweet.find({owner:userId})
    res.status(200).json(new apiResponse(200,allTweets,"All Tweets fetched"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const tweet = req.params.tweetId
    if(!tweet){
        throw new apiError(401,"tweet does not exist")
    }

    const currentTweet = await Tweet.findById(tweet)
    const tweetOwner = currentTweet.owner
    if(!(tweetOwner.equals(req.user._id))){
        throw new apiError(401,"Cannot edit someone else's tweets")
    }

    const {content} = req.body
    const newTweet = await Tweet.findByIdAndUpdate(tweet,{
        $set:{
            content:content
        }
    },{new:true})
    res.status(200).json(new apiResponse(200,newTweet,"Tweet Updated"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const tweet = req.params.tweetId
    if(!tweet){
        throw new apiError(401,"Invalid Tweet ID")
    }

    const currentTweet = await Tweet.findById(tweet)
    const tweetOwner = currentTweet.owner
    if(!(tweetOwner.equals(req.user._id))){
        throw new apiError(401,"cannot delete other's tweets")
    }

    await Tweet.findByIdAndDelete(tweet)

    res.status(200).json(new apiResponse(200,[],"Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}

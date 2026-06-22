import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on video
    const {videoId} = req.params
    const likeDocument = await Like.findOne({
        video:videoId,
        likedBy:req.user._id
    })
    if(!likeDocument){
        const like = await Like.create({
            video:videoId,
            likedBy:req.user._id
        })
        res.status(200).json(new apiResponse(200,like,"Video Liked"))
    }
    else{
        await Like.deleteOne({
            _id : likeDocument._id
        })
        res.status(200).json(new apiResponse(200,{},"Video Disiked"))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on comment
    const {commentId} = req.params
    const likeDocument = await Like.findOne({
        comment:commentId,
        likedBy:req.user._id
    })
    if(!likeDocument){
        const like = await Like.create({
            comment:commentId,
            likedBy:req.user._id
        })
        res.status(200).json(new apiResponse(200,like,"Comment Liked"))
    }
    else{
        await Like.deleteOne({
            _id : likeDocument._id
        })
        res.status(200).json(new apiResponse(200,{},"Comment Disiked"))
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on tweet
    const {tweetId} = req.params
    const likeDocument = await Like.findOne({
        tweet:tweetId,
        likedBy:req.user._id
    })
    if(!likeDocument){
        const like = await Like.create({
            tweet:tweetId,
            likedBy:req.user._id
        })
        res.status(200).json(new apiResponse(200,like,"Tweet Liked"))
    }
    else{
        await Like.deleteOne({
            _id : likeDocument._id
        })
        res.status(200).json(new apiResponse(200,{},"Tweet Disliked"))
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const videos = await Like.find({
        video:{$exists:true},
        likedBy:req.user._id
    })
    res.status(200).json(new apiResponse(200,videos,"Videos fetched"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
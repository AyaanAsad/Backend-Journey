import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subscription.models.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    // TODO: toggle subscription
    const {channelId} = req.params
    const isSubscribed = await Subscription.findOne({
        subscriber:req.user._id,
        channel:channelId
    })
    if(isSubscribed){
        await Subscription.deleteOne({
            _id : isSubscribed._id
        })
        res.status(200).json(new apiResponse(200,{},"Unsubscribed") )
    }
    else{
        const subscribe = await Subscription.create({
            subscriber:req.user._id,
            channel:channelId
        })
        res.status(200).json(new apiResponse(200,subscribe,"Subscribed"))
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {subscriberId} = req.params
    const subscribers = await Subscription.find({
        channel:subscriberId
    }).populate('subscriber','username avatar')
    res.status(200).json(new apiResponse(200,subscribers,"Subscribers fetched"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const channels = await Subscription.find({
        subscriber:channelId
    }).populate('channel','username avatar')
    res.status(200).json(new apiResponse(200,channels,"Channel fetched"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
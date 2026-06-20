import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {UploadOnCloud} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    const { title, description} = req.body
    if(!title || !description){
        throw new apiError(401,"Title and description is mandatory")
    }

    const videoLocal = req.files?.videoFile[0]?.path
    const thumbnailLocal = req.files?.thumbnail[0]?.path
    if(!videoLocal || !thumbnailLocal){
        throw new apiError(401,"Video or thumbnail not found")
    }

    const video = await UploadOnCloud(videoLocal)
    const thumbnailFile = await UploadOnCloud(thumbnailLocal)
    if(!video || !thumbnailFile){
        throw new apiError(401,"Video or thumbnail not found")
    }

    const user = req.user._id
    if(!user){
        throw new apiError(400,"Invalid user")
    }

    const finalVideo = await Video.create({
        videoFile:video.url,
        thumbnail:thumbnailFile.url,
        title,
        description,
        duration:video.duration,
        owner:user
    })

    res.status(200).json(new apiResponse(200,finalVideo,"Video published"))
})

const getVideoById = asyncHandler(async (req, res) => {
    //TODO: get video by id
    const videoId = req.params.videoId
    if(!videoId){
        throw new apiError(401,"Please enter Video ID")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new apiError(401,"No video found")
    }
    res.status(200).json(new apiResponse(200,video,"Video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    //TODO: update video details like title, description, thumbnail
    const videoId= req.params.videoId
    if(!videoId){
        throw new apiError(401,"Please Enter videoId")
    }

    const currentVideo = await Video.findById(videoId)
    const videoOwner = currentVideo.owner
    if(!(videoOwner.equals(req.user._id))){
        throw new apiError(401,"Cannot edit someone else's videos")
    }
    

    const {newTitle, newDescription} = req.body
    const newThumbnailLocal = req.file?.path
    if(!newTitle||!newDescription){
        throw new apiError(401,"Please enter title and description")
    }
    if(!newThumbnailLocal){
        throw new apiError(401,"New Thumbnail not entered")
    }
    const thumbnail = await UploadOnCloud(newThumbnailLocal)
    if(!thumbnail.url){
        throw new apiError(401,"File could not be uploaded to cloud")
    }
    const video = await Video.findByIdAndUpdate(videoId,{
        $set:{
            title:newTitle,
            description:newDescription,
            thumbnail:thumbnail.url
        }   
    },{new:true})

    if(!video){
        throw new apiError(401,"Please enter valid videoID")
    }

    res.status(200).json(new apiResponse(200,video,"Parameters Updated"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    //TODO: delete video
    const videoId = req.params.videoId
    if(!videoId){
        throw new apiError(401,"Please Enter videoId")
    }

    const currentVideo = await Video.findById(videoId)
    const videoOwner = currentVideo.owner
    if(!(videoOwner.equals(req.user._id))){
        throw new apiError(401,"Cannot edit someone else's videos")
    }

    await Video.findByIdAndDelete(videoId)

    res.status(200).json(new apiResponse(200,[],"Video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const videoId = req.params.videoId
    if(!videoId){
        throw new apiError(401,"Please Enter videoId")
    }

    const currentVideo = await Video.findById(videoId)
    const videoOwner = currentVideo.owner
    if(!(videoOwner.equals(req.user._id))){
        throw new apiError(401,"Cannot edit someone else's videos")
    }

    const updatePublish = await Video.findByIdAndUpdate(videoId,{
        $set:{
            isPublished:!currentVideo.isPublished
        }
    },{new:true})

    res.status(200).json(new apiResponse(200,"Publish status toggeled"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}

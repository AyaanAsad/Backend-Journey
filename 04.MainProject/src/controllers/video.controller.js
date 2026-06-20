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
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}

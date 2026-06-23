import mongoose from "mongoose"
import {Comment} from "../models/comment.models.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    
    const pipeline=[
        {$match:{video:videoId}},
        {$lookup:{
            from:'users',
            localField:'owner',
            foreignField:'_id',
            as:'Owner'
        }},
        {$unwind:'$Owner'},
        {$project:{
            content:1,
            'Owner.username':1,
            'Owner.avatar':1
        }}
    ]

    const result = await Comment.aggregatePaginate(
        Comment.aggregate(pipeline),
        {page,limit}
    )

    res.status(200).json(new apiResponse(200,result,"Commenst fecthed"))
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {comment} = req.body
    const videoId = req.params.videoId
    const owner = req.user._id
    if(!comment){
        throw new apiError(400,"Please enter the comment")
    }
    if(!owner){
        throw new apiError(400,"Please login to post a comment")
    }
    const newComment = await Comment.create({
        content:comment,
        video:videoId,
        owner
    })

    res.status(200).json(new apiResponse(200,newComment,"Comment created"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {comment} = req.body
    const {commentId} = req.params
    const owner = req.user._id

    if(!comment){
        throw new apiError(400,"Please enter the comment")
    }

    const existingComment = await Comment.findById(commentId)
    if(!existingComment){
        throw new apiError(404,"Comment not found")
    }

    if(!(existingComment.owner.equals(req.user._id))){
        throw new apiError(403,"You are not authorized to update this comment")
    }           

    const updatedComment = await Comment.findByIdAndUpdate(commentId,{
        $set:{
        content: comment,
        }
    },{new:true})

    res.status(200).json(new apiResponse(200,updatedComment,"Comment updated"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params

    const existingComment = await Comment.findById(commentId)
    if(!existingComment){
        throw new apiError(404,"Comment not found")
    }

    if(!(existingComment.owner.equals(req.user._id))){
        throw new apiError(403,"You are not authorized to delete this comment")
    }

    await Comment.findByIdAndDelete(commentId)

    res.status(200).json(new apiResponse(200,{},"Comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
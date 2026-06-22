import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    //TODO: create playlist
    const {name, description} = req.body
    const playlist = await Playlist.create({
        name,
        description,
        owner:req.user._id
    })
    res.status(200).json(new apiResponse(200,playlist,"Playlist created"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    //TODO: get user playlists
    const {userId} = req.params
    const userPlaylist = await Playlist.find({
        owner:userId
    })
    res.status(200).json(new apiResponse(200,userPlaylist,"All user playlists fetched"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    //TODO: get playlist by id
    const {playlistId} = req.params
    const playlist = await Playlist.findById(playlistId)
    res.status(200).json(new apiResponse(200,playlist,"Playlist fetched"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    const currentPlaylist = await Playlist.findById(playlistId)
    const playlistOwner = currentPlaylist.owner
    if(!(playlistOwner.equals(req.user._id))){
        throw new apiError(401,"Cannot edit someone else's playlists")
    }
    const playlist = await Playlist.findByIdAndUpdate(playlistId,{
        $addToSet:{
            videos:videoId
        }
    },{new:true})
    res.status(200).json(new apiResponse(200,playlist,"Video added"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    // TODO: remove video from playlist
    const {playlistId, videoId} = req.params
    const currentPlaylist = await Playlist.findById(playlistId)
    const playlistOwner = currentPlaylist.owner
    if(!(playlistOwner.equals(req.user._id))){
        throw new apiError(401,"Cannot edit someone else's playlists")
    }
    const playlist = await Playlist.findByIdAndUpdate(playlistId,{
        $pull:{
            videos:videoId
        }
    },{new:true})
    res.status(200).json(new apiResponse(200,playlist,"Video deleted"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    // TODO: delete playlist
    const {playlistId} = req.params
    const currentPlaylist = await Playlist.findById(playlistId)
    const playlistOwner = currentPlaylist.owner
    if(!(playlistOwner.equals(req.user._id))){
        throw new apiError(401,"Cannot edit someone else's playlists")
    }
    await Playlist.findByIdAndDelete(playlistId)
    res.status(200).json(new apiResponse(200,{},"Playlist deleted"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    //TODO: update playlist
    const {playlistId} = req.params
    const {name, description} = req.body
    if(!name && !description){
        throw new apiError(401,"Please enter either name or description")
    }
    const currentPlaylist = await Playlist.findById(playlistId)
    const playlistOwner = currentPlaylist.owner
    if(!(playlistOwner.equals(req.user._id))){
        throw new apiError(401,"Cannot edit someone else's playlists")
    }
    const playlist = await Playlist.findByIdAndUpdate(playlistId,{
        $set:{
            name,
            description
        }
    },{new:true})
    res.status(200).json(new apiResponse(200,playlist,"Name and description editted"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}

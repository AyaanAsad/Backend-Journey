import { asyncHandler } from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js'
import { User } from '../models/user.models.js'
import { UploadOnCloud } from '../utils/cloudinary.js'
import { apiResponse } from '../utils/apiResponse.js'
import jwt from 'jsonwebtoken'
import mongo,{ set } from 'mongoose'

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.GenerateAccessToken()
        const refreshToken = user.GenerateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return {
            accessToken,
            refreshToken
        }
    }
    catch (error) {
        throw new apiError(501, "Tokens could not be generated")
    }
}

const registerUser = asyncHandler(async (req, res) => {

    //get user details from frontend
    //validateion - not empty
    //check if user already exists :username / email
    //check for images
    //check for avatar
    //upload them to cloudinary, avatar
    //create user object - crete entry in db
    //remove password and refresh token field from response 
    //check for user creates ? Return response : error

    //STEP 1
    const { fullname, email, username, password } = req.body

    //STEP 2
    //console.log(email)
    if ([fullname, email, username, password].some((field) => (field.trim() === ""))) {
        throw new apiError(400, "All fields are required")
    }

    //STEP 3
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existingUser) {
        throw new apiError(409, "User with email or username already exists")
    }

    //STEP 4
    const avatarLocal = req.files?.avatar[0]?.path
    const coverImgLocal = req.files?.covrImg[0]?.path
    if (!avatarLocal) {
        throw new apiError(400, "Avatar is required")
    }
    //console.log("coverLocal:", coverImgLocal)

    const avatarImage = await UploadOnCloud(avatarLocal)
    const coverImage = await UploadOnCloud(coverImgLocal)
    //console.log("coverImage:", coverImage)
    // console.log("BODY:", req.body)
    // console.log("FILES:", req.files)

    if (!avatarImage) {
        throw new apiError(400, "Avatar is required")
    }

    //STEP 5
    const user = await User.create({
        fullname,
        avatar: avatarImage.url,
        coverImg: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    //console.log(user)

    //STEP 6
    const createdUser = await User.findById(user._id)?.select("-password -refreshToken")
    if (!createdUser) {
        throw new apiError(500, "Something went wrong while entering user into DB")
    }

    //STEP 7
    return res.status(201).json(
        new apiResponse(200, createdUser, "User created successfully ")
    )
})

const loginUser = asyncHandler(async (req, res) => {

    //accept input from user
    //validation
    //call db for user and pass
    //dehash and decrypt pass
    //check if input match the db
    //generate auth and ref tokens if they match
    //send cookies
    //send response

    const { username, email, password } = req.body

    if (!username && !email) {
        throw new apiError(400, "Enter username or email")
    }

    const user = await User.findOne({ //instance of the userfrom the db, The user we need to check for not the model User
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new apiError(400, "User not registered")
    }

    const isPasswordValid = await user.isPasswordValid(password)

    if (!isPasswordValid) {
        throw new apiError(401, "Invalid Password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(200, {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
                "User logged in succcessfully"
            )
        )
})

const logoutUser = asyncHandler( async (req,res) => {
    //clear cookies
    //clear refresh token

    await User.findByIdAndUpdate(
        req.user._id, 
        {
            $unset:{
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new apiResponse(200, {}, "User logged out succesfully"))
})

const refreshAccessToken = asyncHandler( async (req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new apiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new apiError(401,"Invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new apiError(402,"Refresh token is expired or used")
        }
    
        const options={
            httpOnly:true,
            secure:true
        }
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new apiResponse(200, {accessToken, refreshToken:newRefreshToken}, "Access token refreshed succesfully")
        )
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler( async (req,res) =>{
    const {oldPassword, newPassword} = req.body
    const user = await User.findById(req.user?._id)
    const isPasswordValid = await user.isPasswordValid(oldPassword)
    if(!isPasswordValid){
        throw new apiError(400,"Invalid Password")
    }
    user.password=newPassword
    await user.save({validateBeforeSave:false})

    return res.status(200).json(new apiResponse(200,{},"Password changed successfully"))
})

const getCurrentUser = asyncHandler( async (req,res) =>{
    return res.status(200).json(new apiResponse(200,req.user,"User fetched successfully"))
})

const updateDetals = asyncHandler( async (req,res) => {
    const {fullname, email} = req.body
    if(!fullname || !email){
        throw new apiError(400, "All fields required")
    }
    const user = await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            fullname : fullname,
            email : email
        }
    },{new:true}).select("-password")

    res.status(200).json(new apiResponse(200,user,"Account details updated"))
})

const updateUserAvatar = asyncHandler( async (req,res) =>{
    const avatarLocal = req.file?.path
    if(!avatarLocal){
        throw new apiError(400,"File not found")
    }
    const avatar = await UploadOnCloud(avatarLocal)
    if(!avatar.url){
        throw new apiError(500,"Could not upload avatar")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            avatar:avatar.url
        }
    },{new:true}).select("-password")

    return res.status(200).json(new apiResponse(200,user,"avatar updated"))
})

const updateUserCoverImage = asyncHandler( async (req,res) =>{
    const coverImgLocal = req.file?.path
    if(!coverImgLocal){
        throw new apiError(400,"File not found")
    }
    const coverImg = await UploadOnCloud(coverImgLocal)
    if(!coverImg.url){
        throw new apiError(500,"Could not upload avatar")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            coverImg:coverImg.url
        }
    },{new:true}).select("-password")

    return res.status(200).json(new apiResponse(200,user,"cover Image updated"))
})

const getUserChannelProfile = asyncHandler( async (req,res) =>{
    const {username} = req.params
    if(!(username?.trim())){
        throw new apiError(400,"Username missing")
    }

    const channel = await User.aggregate([
        {
            $match:{
                username: username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }
        },
        {
            $addFields:{
                subscriberCount: {
                    $size:"$subscribers"
                },
                channelsSubscribedToCount:{
                    $size:"$subscribedTo"
                },
                isSubscribed:{
                    $cond:{
                        if : {$in: [req.user?._id,"$subscribers.subscriber"]},
                        then : true,
                        else : false
                    }
                }
            }
        },
        {
            $project:{
                fullname:1,
                username:1,
                subscriberCount:1,
                channelsSubscribedToCount:1,
                isSubscribed:1,
                avatar:1,
                coverImage:1
            }
        }
    ])

    if(!channel?.length){
        throw new apiError(401,"Channel does not exist")
    }

    return res.status(200).json(new apiResponse(200,channel[0],"User channel fetched successfully"))
})

const getWatchHistory = asyncHandler( async (req,res) =>{
    const user = await User.aggregate([
        {
            $match:{
                _id : new mongo.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"Owner",
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            Owner:{
                                $first:"$Owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res.status(200).json(new apiError(200,user[0].watchHistory,"Watch History fetched successfully"))
})

export { 
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser,
    updateDetals,
    updateUserAvatar,
    getUserChannelProfile,
    getWatchHistory,
    updateUserCoverImage
}

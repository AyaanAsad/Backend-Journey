import {asyncHandler} from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js'
import { User } from '../models/user.models.js'
import { UploadOnCloud } from '../utils/cloudinary.js'
import { apiResponse } from '../utils/apiResponse.js'

const registerUser = asyncHandler( async (req,res) => {

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
    const {fullname, email, username, password} = req.body

    //STEP 2
    console.log(email)
    if( [fullname,email,username,password].some( (field) => (field.trim() === "")) ){
        throw new apiError(400, "All fields are required")
    }

    //STEP 3
    const existingUser = User.findOne({
        $or:[ { email },{ username } ]
    })
    if (existingUser) {
        throw new apiError(409, "User with email or username already exists")
    }

    //STEP 4
    const avatarLocal = req.files?.avatar[0]?.path
    const coverImgLocal = req.files?.covrImg[0]?.path
    if (!avatarLocal) {
        throw new apiError(400,"Avatar is required")
    }
    const avatarImage = await UploadOnCloud(avatarLocal)
    const coverImage = await UploadOnCloud(coverImgLocal)
    if(!avatarImage){
        throw new apiError(400,"Avatar is required")
    }

    //STEP 5
    const user = await User.create({
        fullname,
        avatarImage: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()

    })

    //STEP 6
    const createdUser = await User.findById(user._id)?.select( "-password -refreshToken" )
    if(!createdUser){
        throw new apiError(500, "Something went wrong while entering user into DB")
    }

    //STEP 7
    return res.status(201).json(
        new apiResponse(200, createdUser, "User created successfully ")
    )
})

export {registerUser}
import mongo from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const UserSchema = new mongo.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String, //cloudinaru url
        required:true,
    },
    coverImg:{
        type:String, //cloudinaryUrl
    },
    watchHistory:{
        type:
        [
            {
                type: mongo.Schema.Types.ObjectId,
                ref:'Video'
            }
        ]
    },
    password:{
        type:String,
        required:[true,"Password in required"]
    },
    refreshToken:{
        type:String,

    }
},{timestamps:true})


UserSchema.pre("save", async function () {
    if (!this.isModified('password')) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10)
})

UserSchema.methods.isPasswordValid = async function(password){
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.GenerateAccessToken = function(){
    return jwt.sign(
    {
        _id:this._id,
        email:this.email,
    },process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

UserSchema.methods.GenerateRefreshToken = function(){
    return jwt.sign(
    {
        _id:this._id,
        email:this.email,
    },process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User = mongo.model('User',UserSchema)
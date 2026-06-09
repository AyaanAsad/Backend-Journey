import mongo from 'mongoose'

const userSchema = new mongo.Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    }
},{timestamps:true})

export const User = mongo.model('User', userSchema)
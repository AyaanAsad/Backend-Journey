import mongo from 'mongoose'

const subscriptionSchema = new mongo.Schema({
    subscriber:{
        type: mongo.Schema.Types.ObjectId, //one who is subscribing
        ref:'User'
    },
    channel:{
        type: mongo.Schema.Types.ObjectId, //one who owns the channel
        ref:'User'
    }
},{timestamps:true})

export const Subscription = mongo.model('Subscription',subscriptionSchema)
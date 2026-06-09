import mongo from 'mongoose'

const subtodoSchema = new mongo.Schema({
    content:{
        type: String,
        required: true
    },
    isComplete:{
        type: Boolean,
        default: false
    },
    createdBy:{
        type: mongo.Schema.Types.ObjectId,
        ref : 'User'
    }
},{timestamps:true})

export const SubTodo = mongo.model('SubTodo', subtodoSchema)
import mongo from 'mongoose'

const todoSchema = new mongo.Schema({
    content:{
        type: String,
        required: true,
    },
    complete:{
        type:Boolean,
        deafult: false
    },
    createdBy:{
        type: mongo.Schema.Types.ObjectId,
        ref = 'User',
    },
    subtodos: [
        {
            type: mongo.Schema.Types.ObjectId,
            ref : 'SubTodo',
        }
    ] //Array of subtodos
},{timestamps:true})

export const Todo = mongo.model('Todo', todoSchema)
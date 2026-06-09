import mongo from 'mongoose'

const ProductSchema = new mongo.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    productImage: {
        type:String
    },
    price: {
        type: Number,
        default: 0,
        required: true
    },
    stock: {
        type: Number,
        default: 0,
        required: true
    },
    category:{
        type: mongo.Schema.Types.ObjectId,
        ref : 'Category',
        required: true
    },
    owner:{
        type: mongo.Schema.Types.ObjectId,
        ref : 'User',
        required: true
    }
},{timestamps:true})

export const Product = mongo.model('Product',ProductSchema)
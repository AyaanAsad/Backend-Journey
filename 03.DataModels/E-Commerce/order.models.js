import mongo from 'mongoose'

const orderItemsSchema = mongo.Schema({
    productID:{
        type: mongo.Schema.Types.ObjectId,
        ref: 'Product'
    },
    Quantity:{
        type:Number,
        required: true
    }
})

const orderSchema = new mongo.Schema({
    TotalPrice: {
        type:Number,
        required:true
    },
    Customer: {
        type:mongo.Schema.Types.ObjectId,
        ref:'User'
    },
    OrderItems: {
        type : [orderItemsSchema]
    },
    Address: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        enum: ['PENDING','CANCELLED','DEIVERED','IN-TRANSIT'],
        default: 'pending'
    }
},{timestamps:true})

export const Order = mongo.model('Order',orderSchema)
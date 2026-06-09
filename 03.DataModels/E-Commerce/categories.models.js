import mongo from 'mongoose'

const CategorySchema = new mongo.Schema({
    name:{
        type:String,
        required:true
    },
},{timestamps:true})

export const Category = mongo.model('Category',CategorySchema)
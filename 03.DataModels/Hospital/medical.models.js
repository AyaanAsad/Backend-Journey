import mongo from 'mongoose'

const MedicalSchema = new mongo.Schema({

}, {timestamps: true} //gives createdAt and updatedAt by default
)

export const Medical = mongo.model("Medical", MedicalSchema)

import mongo from 'mongoose'

const HospitalSchema = new mongo.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type:String,
        required: true
    },
    city: {
        type:String,
        required: true
    },
    pincode: {
        type:String,
        required: true
    },
    specialization: {
        type:
        [
            {
                type:String
            },
        ],
    },
}, {timestamps: true} //gives createdAt and updatedAt by default
)

export const Hospital = mongo.model("Hospital", HospitalSchema)

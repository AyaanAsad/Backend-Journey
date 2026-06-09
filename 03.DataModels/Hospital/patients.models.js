import mongo from 'mongoose'

const PatientSchema = new mongo.Schema({
    name: {
        type: String,
        required: true
    },
    diagnosed: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum : ['MALE','FEMALE','OTHERS']
    },
    admittedIn:{
        type: mongo.Schema.Types.ObjectId,
        ref: "Hospital"
    }
}, {timestamps: true} //gives createdAt and updatedAt by default
)

export const Patient = mongo.model("Patient", PatientSchema)

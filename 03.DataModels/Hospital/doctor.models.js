import mongo from 'mongoose'

const HospitalHours =new mongo.Schema({
    hours: {
        type: Number,
        required: true
    },
    name: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'Hospital'
    }
})

const DoctorSchema = new mongo.Schema({
    name: {
        type:String,
        requried:true
    },
    salary: {
        type:Number,
        requried:true
    },
    qualifications: {
        type:String,
        required:true
    },
    experience: {
        type:Number,
        default:0
    },
    worksIn: {
        type: [HospitalHours]
    }
}, {timestamps: true} //gives createdAt and updatedAt by default
)

export const Doctor = mongo.model("Doctor", DoctorSchema)

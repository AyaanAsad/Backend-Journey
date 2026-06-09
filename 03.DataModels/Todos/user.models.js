import mongo from 'mongoose'

const userSchema = new mongo.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'password is required'] //custom validator
    }
}, {timestamps: true} //gives createdAt and updatedAt by default
)

export const User = mongo.model("User", userSchema)

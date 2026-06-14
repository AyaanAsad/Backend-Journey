import mongo from 'mongoose'
import { DB_NAME } from '../constants.js'

const DBConnect = async () => {
    try {
        const connectionInstance = await mongo.connect(`${process.env.MONGO_URI_LOCAL}/${DB_NAME}`)
        console.log(`Connection established for ${connectionInstance.connection.host}`)
        console.log(`Connection established for DBNAME: ${mongo.connection.name}`)
    }
    catch (err) {
        console.log(err)
        process.exit(1)
    }
}



export default DBConnect
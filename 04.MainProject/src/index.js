import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import {app} from "./app.js"

import dotenv from 'dotenv'
dotenv.config({
    path: './env'
})
import DBConnect from './database/index.js'

DBConnect()//returns a promise
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`SERVER STARTED AT PORT ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log(`MONGODB CONNECTION ERROR: ${err}`)
})
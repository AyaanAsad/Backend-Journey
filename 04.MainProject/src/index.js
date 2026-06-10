import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import dotenv from 'dotenv'
dotenv.config({
    path: './env'
})
import DBConnect from './database/index.js'

DBConnect()//returns a promise
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`SERVER STARTED AT PORT ${procedd.env.PORT}`)
    })
})
.catch((err) => {
    console.log(`MONGODB CONNECTION ERROR: ${err}`)
})
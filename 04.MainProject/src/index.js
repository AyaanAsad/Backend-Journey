import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import dotenv from 'dotenv'
dotenv.config({
    path: './env'
})
import DBConnect from './database/index.js'

console.log("URI:", process.env.MONGO_URI_LOCAL)
DBConnect()
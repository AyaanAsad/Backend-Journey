import express from 'express' 
import cors from 'cors' // decides who is allowed to talk to your server, like a bouncer at a door
import cookieparser from 'cookie-parser' // reads cookies sent by the browser, like reading a guests loyalty card

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
//Giving instructions to the bouncer at the door
// -> only website listed in the env is allowed access
// -> credentials: true means cookies and login info are allowed to come through too.

app.use(express.json({
    limit: "16kb"
}))
//When someone sends data in JSON format (like a form), accept it — but max 16kb.

app.use(express.urlencoded({ 
    extended: true,
    limit: "16kb"
}))
//Sometimes data comes from a URL like name=John&age=25 (the %20 and + stuff).
//The above part handles this situation too
// -> extended: true = handle complex/nested data too, not just flat key-value pairs.

app.use(express.static('public')) 
//If someone asks for an image or file, look in the public folder.

app.use(cookieparser())
//read cookies from incoming requests
//cookies = tiny notes the browser stores like : 'this user is logged in'

//----------------------------------------------ROUTES IMPORT-----------------------------------------------

import userRouter from './routes/user.routes.js'

//----------------------------------------------ROUTES DECLARE-----------------------------------------------

app.use('/api/v1/users', userRouter)

export {app}
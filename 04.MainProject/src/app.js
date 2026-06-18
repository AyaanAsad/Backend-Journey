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
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

//----------------------------------------------ROUTES DECLARE-----------------------------------------------

app.use('/api/v1/users', userRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)

export {app}
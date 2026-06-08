require('dotenv').config()
const express = require('express')
const app = express()

app.get('/', (requst,response) => {
    response.send('Hello World !')
})

app.get('/twitter', (request,response) => {
    response.send('www.x.com')
})

app.get('/login', (request,response) => {
    response.send('<h1>Login Page</h1>')
})


app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port : ${process.env.PORT}`)
})
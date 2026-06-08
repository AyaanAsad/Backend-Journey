import express from 'express'
const app = express()
import env from 'dotenv'
env.config()

const jokes = [
        {
            id: 1,
            title: 'Programmer Joke',
            content: 'Why do programmers prefer dark mode? Because light attracts bugs.'
        },
        {
            id: 2,
            title: 'Database Joke',
            content: 'I told my database a joke. It did not laugh, but it did commit.'
        },
        {
            id: 3,
            title: 'JavaScript Joke',
            content: 'Why was the JavaScript developer sad? Because he did not know how to null his feelings.'
        },
        {
            id: 4,
            title: 'Backend Joke',
            content: 'A backend developer walks into a bar, a pub, a cafe, and a tavern. He was testing the API.'
        },
        {
            id: 5,
            title: 'Debugging Joke',
            content: 'Debugging is like being the detective in a crime movie where you are also the murderer.'
        }
    ];    

app.get('/', (req, res) => {
    res.send("Server started")
})

const port = process.env.PORT

app.get('/api/jokes', (req, res) => {
    res.send(jokes)
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
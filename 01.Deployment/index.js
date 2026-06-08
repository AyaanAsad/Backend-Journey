require('dotenv').config()
const express = require('express')
const app = express()
const githubData = {
  "login": "AyaanAsad",
  "id": 213043629,
  "node_id": "U_kgDODLLJrQ",
  "avatar_url": "https://avatars.githubusercontent.com/u/213043629?v=4",
  "gravatar_id": "",
  "url": "https://api.github.com/users/AyaanAsad",
  "html_url": "https://github.com/AyaanAsad",
  "followers_url": "https://api.github.com/users/AyaanAsad/followers",
  "following_url": "https://api.github.com/users/AyaanAsad/following{/other_user}",
  "gists_url": "https://api.github.com/users/AyaanAsad/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/AyaanAsad/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/AyaanAsad/subscriptions",
  "organizations_url": "https://api.github.com/users/AyaanAsad/orgs",
  "repos_url": "https://api.github.com/users/AyaanAsad/repos",
  "events_url": "https://api.github.com/users/AyaanAsad/events{/privacy}",
  "received_events_url": "https://api.github.com/users/AyaanAsad/received_events",
  "type": "User",
  "user_view_type": "public",
  "site_admin": false,
  "name": "Ayaan Asad",
  "company": null,
  "blog": "",
  "location": null,
  "email": null,
  "hireable": null,
  "bio": "I like computers",
  "twitter_username": null,
  "public_repos": 4,
  "public_gists": 0,
  "followers": 0,
  "following": 0,
  "created_at": "2025-05-23T10:32:13Z",
  "updated_at": "2026-05-20T07:30:45Z"
}

app.get('/', (requst,response) => {
    response.send('Hello World !')
})

app.get('/twitter', (request,response) => {
    response.send('www.x.com')
})

app.get('/login', (request,response) => {
    response.send('<h1>Login Page</h1>')
})

app.get('/github', (req,res) => {
    res.json(githubData)
})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port : ${process.env.PORT}`)
})
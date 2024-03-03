
# Spotify_clone Web App

It is a clone of spotify web music player having all minimum required features.
MERN Stack is used to develop this project.

In frontend
- We are using "Vite + React" and tailwind css for styling.

In backend
- We are using node.js and mongodb.


## Acknowledgements

 - [silent_voice](https://github.com/silentvoice143)
 - [tailwind css](https://tailwindcss.com/docs/guides/vite)
 - [firebase](https://console.firebase.google.com)


## 🚀 About Me
I'm a full stack developer...
A passionate developer and programmer | MERN Stack developer


## Features

- Admin signup/login.
- Add new song to database for admin.
- Create Playlist, add song to it, edit playlist details.
- Public and private playlist toggle.
- User Dashboard.
- Play/Pause song.


## Requirements

- node.js
- mongodb

both should be installed and make sure mongodb is running.
## Installation

Installation steps:- 

### For frontend
- Move to client folder and then type npm install in terminal to install all dependencies.
```bash
cd client
npm install
```
- Create a .env file inside client folder with these variables.

```bash
VITE_APIKEY=[firebase_api_key]
VITE_AUTHDOMAIN=[firebase_auth_domain_]
VITE_PROJECT_ID=[firebase_project_Id],
VITE_STORAGE_BUCKET=[firebase_storage_bucket_address]
VITE_MESSAGINGSENDER_ID=[firebase_messagingsender_Id]
VITE_APP_ID=[firebase_App_Id]
VITE_MEASUREMENT_ID=[firbase_Measurement_Id]
```

Make sure to name each environment variable starts with `VITE_` so that vite can resolve it.

- To start frontend

```bash
npm run dev
```

### For backend

-Move to server folder and then type npm install in terminal to install all dependencies.

```bash
cd server
npm install
```

- Create a .env file inside server folder with these variables.

```bash
JWTPRIVATEKEY=[Any_Secret_key]
MONGODB_URI=[Your_mongodb_url]

```

- To start backend server

```bash
node index.js
or
nodemon index.js
```

## Demo

https://www.linkedin.com/posts/satyam-kumar-550b4025a_spotify-clone-hiiiii-everyone-i-hope-all-activity-7165609014549049345-pTGq?utm_source=share&utm_medium=member_desktop
    

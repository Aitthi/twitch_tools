const express = require('express')
const http = require('http')
const socket = require('socket.io')
const path = require('path')

class Display {

    options = {
        port: 3000,
        background_color: "#009688"
    }
    
    io = null

    constructor(options = {}) {
        this.options = {
            ...this.options,
            ...options
        }

        var app = express()
        app.set("view engine", "ejs")
        app.set('views', path.join(__dirname, `../views`))
        app.get("/", (req, res) => {
            res.render("display",{
                background_color: this.options.background_color,
                data: JSON.stringify({
                    message: "Hello"
                })
            })
        })
        var server = http.Server(app)
        this.io = socket(server)
        server.listen(this.options.port, () => {
            console.log(`listening on *:${this.options.port}`)
            this.io.on('connection', (socket) => {
                console.log('socket connected')
            })
        })

    }


    emit(channel, data){
        this.io.emit(channel, data)
    }

    alert(options = {}){
        // Default options
        let _options = {
            animate: "animate__bounceIn", // other animate https://animate.style/
            image_src: "https://media.giphy.com/media/l0HUjDphISoMMCMPm/giphy.gif", // All that "html" support
            sound_src: "https://assets.mixkit.co/sfx/preview/mixkit-retro-game-notification-212.mp3",
            volume: 1, // max 1 min 0 step 0.[1-9],
            alert_timeout: 2000, // milliseconds
            ...options
        } 
        this.emit("alert", _options)
    }

}

// let display = new Display()
// setInterval(() =>{
//     // display
//     display.alert()
// },4000)
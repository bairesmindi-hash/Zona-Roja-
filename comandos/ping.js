const Discord = require ('discord.js')

module.exports = { 
    name: "ping",
    alias:  [ ],

    execute (client, message, args){

        message.replay('🏓 !pong! ${client.ws.ping}ms')
    }
}
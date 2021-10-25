exports.run = (client, message, args) => {
    message.channel.send(process.env.COMMANDS);
}
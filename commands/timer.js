const muteSet = new Map();
exports.run = (client, message, args) => {
    let duration = parseInt(args[0] * 1000);
    if (muteSet.has(message.author.id)) {
        const cd = muteSet.get(message.author.id);
        message.channel.send(`${Math.floor((cd - Date.now())/1000)} seconds left`)
    } else {
        muteSet.set(message.author.id, Date.now() + duration);
        console.log(muteSet);
        setTimeout(() => {
            muteSet.delete(message.author.id)
          }, duration)
    }
}
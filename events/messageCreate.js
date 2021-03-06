module.exports = (client, message) => {
    if (message.author.bot) return;
    if (message.content.indexOf(process.env.prefix) !== 0) return;

    // Our standard argument/command name definition.
    const args = message.content.slice(process.env.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    // Grab the command data from the client.commands Enmap
    const cmd = client.commands.get(command);
  
    // If that command doesn't exist, silently exit and do nothing
    if (!cmd) return;
  
    // Run the command
    cmd.run(client, message, args);
  };
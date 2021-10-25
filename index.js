require('dotenv').config();
const fs = require("fs");
const axios = require('axios');
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: 
	[Intents.FLAGS.GUILDS, 
	Intents.FLAGS.GUILD_MESSAGES, 
	Intents.FLAGS.GUILD_VOICE_STATES, 
	Intents.FLAGS.GUILD_MEMBERS] 
});
client.commands = new Discord.Collection();

//Text based turn game that DMs users based on what they put into a text channel? (deals them their 'hand' by DMing them)

const events = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of events) {
  const eventName = file.split(".")[0];
  const event = require(`./events/${file}`);
  client.on(eventName, event.bind(null, client));
}

const commands = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commands) {
  const commandName = file.split(".")[0];
  const command = require(`./commands/${file}`);

  console.log(`Attempting to load command ${commandName}`);
  client.commands.set(commandName, command);
}

//Move specified user to specified voiceChannel.

client.login(process.env.CLIENT_TOKEN); //login bot using token, make sure this is last line.

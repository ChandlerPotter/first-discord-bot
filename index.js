//Discord bot that says 
require('dotenv').config();
const axios = require('axios');
const Discord = require('discord.js');
var snoowrap = require('snoowrap');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });



client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
	switch(msg.content) {
		case 'ping':
			msg.reply('Pong');
			break;
		case '!meme':
			msg.channel.send("Here's your meme!");
			let response = await generateMeme();
			msg.channel.send(response);
			break;
		case "!eye":
			msg.channel.send("You are now subscribed to eye reminders.");
				interval = setInterval (function () {
				msg.channel.send("Please take an eye break now!")
				.catch(console.error); 
			}, 3600000); //every hour
			break;
		}
});

//Send message if a user joins a voice channel

async function generateMeme() {
	const r = new snoowrap({
		userAgent: 'This thing gets memes! ROFLMAO',
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		refreshToken: process.env.REFRESH_TOKEN
	  });
  
	const subreddit = await r.getSubreddit('memes');
	const randomPost = await subreddit.getRandomSubmission();
	
	return randomPost['url'];
  };


client.login(process.env.CLIENT_TOKEN); //login bot using token, make sure this is last line.

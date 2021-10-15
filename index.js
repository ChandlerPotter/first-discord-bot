//Discord bot that says 
require('dotenv').config();
const axios = require('axios');
const Discord = require('discord.js');
var snoowrap = require('snoowrap');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });


client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
	let newUserChannel = newState.channelId
	let oldUserChannel = oldState.channelId
	const textChannel = await client.channels.fetch('898622565835223040') //General text channel

	switch (true) {
		case (!oldUserChannel && newUserChannel !== null):
			 // User Joins a voice channel
		  if (!textChannel) {console.log('No Channel exists')}
		  textChannel.send(`${newState.member.displayName} joined ${newState.channel.name}!`);
		  break;
		case (!newUserChannel):
			// User leaves a channel 
		  if (!textChannel) {console.log('No Channel exists')}
		  textChannel.send(`${newState.member.displayName} left ${oldState.channel.name}!`);
		  break;
		case (oldUserChannel && newUserChannel && oldUserChannel !== newUserChannel):
			// User leaves a channel and Joins a new channel
		  if (!textChannel) {console.log('No Channel exists')}
		  textChannel.send(`${newState.member.displayName} left ${oldState.channel.name} and joined ${newState.channel.name}`);
	}
  })

  

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
		}
});

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

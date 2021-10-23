require('dotenv').config();
const axios = require('axios');
const Discord = require('discord.js');
var snoowrap = require('snoowrap');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: 
	[Intents.FLAGS.GUILDS, 
	Intents.FLAGS.GUILD_MESSAGES, 
	Intents.FLAGS.GUILD_VOICE_STATES, 
	Intents.FLAGS.GUILD_MEMBERS] 
});
let userArr = []

//Text based turn game that DMs users based on what they put into a text channel? (deals them their 'hand' by DMing them)


client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
	let newUserChannel = newState.channelId
	let oldUserChannel = oldState.channelId
	const textChannel = await getTextChannel('898622565835223040');

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

  
client.on('messageCreate', async msg => {
	const arr = msg.content.split(' ');
	switch(arr[0]) {
		case '!ping':
			msg.reply(':eyes:');
			break;
		case '!meme':
			msg.channel.send("Here's your meme!");
			let response = await generateMeme().catch(console.error);
			msg.channel.send(response);
			break;
		case '!users':
			const guild = await getGuild('897717329432039464');
			const members = await guild.members.fetch()
			userList(msg.channel, guild, members);
			break;
		case '!commands':
			msg.channel.send('!ping: Recieve a pong\n!meme: Generate a meme\n!eye: Set reminders\n!users: Get list of users');
			break;
		case '!mute':
			const ownerBool = await isOwner(msg.author.id);
			if (!ownerBool){ msg.channel.send(`You are not the server owner. You cannot mute.`) }
			else if (arr[1] && ownerBool){ 
				const members_mute = await (await getGuild('897717329432039464')).members.fetch();
				const match = members_mute.find(m => m.displayName.toLowerCase() === arr[1].toLowerCase());
				if (match.voice.channel) { muteMember(arr[1]) } 
				else { msg.channel.send('User is not in a Voice Channel.') }
			}
			else { msg.channel.send('No user specified') }
			break;
		}
});

client.on('guildMemberAdd', async newMember => {
	newMember.send(`Welcome to ${newMember.guild.name}!`);
	userArr.push(newMember.displayName);
})

client.on('guildMemberRemove', async oldMember => {
	const index = userArr.indexOf(oldMember.displayName);
	if (index > -1) { userArr.splice(index, 1) }
})

//Move specified user to specified voiceChannel.

//Possibly use a .txt file to store the list of users.
async function userList(ch, g, m) {
	ch.send(`Total Number of users on server: ${g.memberCount}`)
	if (userArr.length === 0) {
		m.each(user => userArr.push(user.displayName));
	}
	ch.send(userArr.join('\n'));
}

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

async function muteMember(userName) { 
	const guild2 = await client.guilds.fetch('897717329432039464');
	const channel = await client.channels.fetch('898622565835223040')
	const s = await guild2.members.fetch()
	s.each(user => {
		const lowerCaseName = user.displayName.toLowerCase();
		if (lowerCaseName === userName.toLowerCase()){
			if (!user.voice.serverMute && user.voice.channel) { 
				user.voice.setMute(true);
				channel.send(`${user.displayName} has been muted.`)
			}
			else if (user.voice.serverMute && user.voice.channel){ 
				user.voice.setMute(false);
				channel.send(`${user.displayName} has been unmuted.`)
			}
			return
		}
	})
}

async function isOwner(userID) {
	const adminID = (await client.guilds.fetch('897717329432039464')).ownerId;
	return (userID === adminID);
}

async function getTextChannel(cID) {
	return await client.channels.fetch(cID);
}

async function getGuild(gID) {
	return await client.guilds.fetch(gID);
}


client.login(process.env.CLIENT_TOKEN); //login bot using token, make sure this is last line.

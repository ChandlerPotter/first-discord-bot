/*Server mutes specified user. Currently this command can only be used by the server owner. */
const muteSet = new Map();
exports.run = async (client, message, args) => {
    const guild = await client.guilds.fetch(process.env.gID);
    const ownerBool = await isOwner(message.author.id, guild);
	const members_mute = await guild.members.fetch();
		switch (true) {
			case (!ownerBool):
				let guild_mem = await guild.members.fetch(message.author.id);
				if (muteSet.has(message.author.id)) {
					const cd = muteSet.get(message.author.id);
					let seconds = Math.floor((cd - Date.now())/1000);
					let minutes = Math.floor((cd - Date.now())/60000);
					let dec_minutes = ((cd - Date.now())/60000).toFixed(2);
					let decimal = dec_minutes - Math.floor((cd - Date.now())/60000);
					let dec_seconds = Math.floor(decimal * 60);
					if (seconds > 60) { message.author.send(`You have ${minutes} minutes and ${dec_seconds} seconds left until you are unmuted.`) }
					else { message.author.send(`You have ${seconds} seconds left until you are unmuted`) }
				} 
				else if(!muteSet.has(message.author.id) && guild_mem.voice.serverMute) {
					message.author.send(`You have bee muted indefinitely. Only the server owner can save you.`)
				}
				else {
					message.author.send(`You are not the server owner. You cannot mute.`) 
				}
				break;
			case (ownerBool):
				if (args.length === 0) { message.channel.send('No user specified') }
				else if (args.length === 1) {
            		const match = members_mute.find(m => m.displayName.toLowerCase() === args[0].toLowerCase());
					if (!match){message.channel.send('User does not exist')}
					else {
						muteMember(args[0], guild, message.channel);
					} 
				}
				else if (args.length === 2) {
					muteMember(args[0], guild, message.channel, args[1]);
					unMuteMember(args[0], guild, message.channel, args[1]);
				} else {
					message.channel.send('Too many arguments. Please try again.')
				}
				break;
		}
}

async function isOwner(userID, g) {
	const adminID = g.ownerId;
	return (userID === adminID);
}

async function muteMember(userName, g, c, time=0) { 
	const s = await g.members.fetch()
	let duration = parseInt(time * 60000);
	s.each(user => {
		const lowerCaseName = user.displayName.toLowerCase();
		if (lowerCaseName === userName.toLowerCase()){
			if (!user.voice.serverMute && user.voice.channel) { 
				user.voice.setMute(true);
				if (duration != 0){
				muteSet.set(user.id, Date.now() + duration);
        		setTimeout(() => {
            		muteSet.delete(user.id)
          		  }, duration)
				c.send(`${user.displayName} has been muted for ${time} minutes.`)
				}
				else {c.send(`${user.displayName} has been muted indefinitely.`)}
			}
			else if (user.voice.serverMute && user.voice.channel){ 
				user.voice.setMute(false);
				if (duration != 0) {
					muteSet.delete(user.id);
					c.send(`${user.displayName} has been unmuted.`)
				} else {
					c.send(`${user.displayName} has been unmuted.`)
				}
			}
			return
		}
	})
}

function unMuteMember(userName, g, c, minutes) {
	let duration = minutes * 60000;
	setTimeout(function () {
		unMuteMemberHelper(userName, g);
		c.send(`${userName} has been unmuted.`)
	}, duration);
}


async function unMuteMemberHelper(userName, g) {
	const s = await g.members.fetch()
	s.each(user => {
		const lowerCaseName = user.displayName.toLowerCase();
		if (lowerCaseName === userName.toLowerCase()){
			user.voice.setMute(false);
		}
		return 
	})
}
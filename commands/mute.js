exports.run = async (client, message, args) => {
    const guild = await client.guilds.fetch(process.env.gID);
    const ownerBool = await isOwner(message.author.id, guild);
        if (!ownerBool){ message.channel.send(`You are not the server owner. You cannot mute.`) }
        else if (args.length !== 0 && ownerBool){ 
            const members_mute = await guild.members.fetch();
            const match = members_mute.find(m => m.displayName.toLowerCase() === args[0].toLowerCase());
            if (!match){message.channel.send('User does not exist')}
            else if (match.voice.channel) { muteMember(args[0], guild, message.channel) } 
            else { message.channel.send('User is not in a Voice Channel.') }
        }
        else { message.channel.send('No user specified') }
}

async function isOwner(userID, g) {
	const adminID = g.ownerId;
	return (userID === adminID);
}

async function muteMember(userName, g, c) { 
	const s = await g.members.fetch()
	s.each(user => {
		const lowerCaseName = user.displayName.toLowerCase();
		if (lowerCaseName === userName.toLowerCase()){
			if (!user.voice.serverMute && user.voice.channel) { 
				user.voice.setMute(true);
				c.send(`${user.displayName} has been muted.`)
			}
			else if (user.voice.serverMute && user.voice.channel){ 
				user.voice.setMute(false);
				c.send(`${user.displayName} has been unmuted.`)
			}
			return
		}
	})
}
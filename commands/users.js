exports.run = async (client, message, args) => {
	let userArr = []
	const fs = require('fs');
	const file = fs.createWriteStream('userList.txt');
    const guild = await client.guilds.fetch(process.env.gID);
	const members = await guild.members.fetch()
	userList(message.channel, guild, members);

	async function userList(ch, g, m) {
		ch.send(`Total Number of users on server: ${g.memberCount}`)
		//m.each(user => userArr.push(user.displayName));
		file.on('error', function(err) { if (err) throw err; });
		m.each(user => file.write(user.displayName +'\n'));
		file.end();
		//ch.send(userArr.join('\n'));
	}

	//function to write objects to JSON file, instead of writing to txt file.
	//https://stackoverflow.com/questions/36856232/write-add-data-in-json-file-using-node-js
}

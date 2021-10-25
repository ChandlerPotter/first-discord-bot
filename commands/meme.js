var snoowrap = require('snoowrap');

exports.run = async (client, message, args) => {
    message.channel.send("Here's your meme!");
	let response = await generateMeme().catch(console.error);
	message.channel.send(response);
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
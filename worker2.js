const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			return;
		}
    }
    
    if (reaction.message.content.includes('Teszt'))
        reaction.message.react(client.emojis.cache.get("745207133657890856"));
});

client.login(process.env.TOKEN2);
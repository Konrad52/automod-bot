const Discord = require('discord.js');
const client = new Discord.Client();
const censored_words = [ 'fasz', 'pina', 'kurva', 'picsa', 'geci', 'köcsög', 'nyomorék' ]

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  var needs_censor = false;

  for (let i = 0; i < censored_words.length; i++) {
    if (msg.content.includes(censored_words[i])) 
      needs_censor = true;
  }

  if (needs_censor) {
    msg.delete(1000);
    msg.reply('Tiltott szavakat használtál az üzenetetben! A megfelelő szóhasználatra kérlek figyelj oda.');
  }
});

client.login(process.env.TOKEN);
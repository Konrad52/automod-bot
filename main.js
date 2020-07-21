const Discord = require('discord.js');
const client = new Discord.Client();
const censored_words = process.env.CENSORED_WORDS.split(',');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  var needs_censor = false;

  for (let i = 0; i < censored_words.length; i++) {
    if (msg.content.toLowerCase().includes(censored_words[i])) 
      needs_censor = true;
  }

  if (needs_censor) {
    msg.delete();
    msg.reply(process.env.RESPONSE_MSG);
  }
});

client.login(process.env.TOKEN);
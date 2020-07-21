const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.includes('fasz')) {
    msg.reply('Enyje, nem szabad így beszélni.');
  }
});

client.login(process.env.TOKEN);
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

client.login('NzM1MDU5OTI3Njg4Njc1MzM5.Xxav-A.59gG_esvvgU4AL1caiGK_J9NMK8');

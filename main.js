const Discord = require('discord.js');
const client = new Discord.Client();

const censored_words = process.env.CENSORED_WORDS.split(',');

var warning_1_users = [ { username: 'test#0000', timeout: 3 } ];
var warning_2_users = [ { username: 'test#0000', timeout: 3 } ];
var muted_users     = [ { username: 'test#0000', timeout: 3 } ];

function lower_risk_level() {
  warning_1_users.forEach(element => {
    if (timeout > 0)
    timeout--;
  });
  warning_2_users.forEach(element => {
    if (timeout > 0)
    timeout--;
  });
  muted_users.forEach(element => {
    if (timeout > 0)
    timeout--;
  });
  console.log('Lowered warning levels!');
}

setInterval(lower_risk_level, 60000);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  var needs_censor = false;
  var censor_level = 0;

  for (let i = 0; i < censored_words.length; i++) {
    if (msg.content.toLowerCase().includes(censored_words[i])) {
      needs_censor = true;
    }
  }

  if (needs_censor) {
    warning_1_users.forEach(element => {
      if (msg.author.toString() == element.username && element.timeout > 0) {
        censor_level = 1;
        element.timeout = 3;
      }
    });
    warning_2_users.forEach(element => {
      if (msg.author.toString() == element.username && element.timeout > 0) {
        censor_level = 2;
        element.timeout = 3;
      }
    });
    muted_users.forEach(element => {
      if (msg.author.toString() == element.username && element.timeout > 0) {
        censor_level = 3;
        element.timeout = 3;
      }
    });

    switch (censor_level) {
      case 0: {
        warning_1_users.push({ username: msg.author, timeout: 3 }); 
        msg.reply(process.env.RESPONSE_MSG_1); 
        break;
      }
      case 1: {
        warning_2_users.push({ username: msg.author, timeout: 3 }); 
        msg.reply(process.env.RESPONSE_MSG_2); 
        break;
      }
      case 2: {
        muted_users.push    ({ username: msg.author, timeout: 3 }); 
        msg.reply(process.env.RESPONSE_MSG_3); 
        break;
      }
    }

    msg.delete();
  }
});

client.login(process.env.TOKEN);
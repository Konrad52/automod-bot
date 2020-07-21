const Discord = require('discord.js');
const client = new Discord.Client();

const censored_words = process.env.CENSORED_WORDS.split(',');

var warning_1_users = [ { username: '', timeout: 3 } ];
var warning_2_users = [ { username: '', timeout: 3 } ];
var warning_3_users = [ { username: '', timeout: 3 } ];
var muted_users     = [ { username: '', timeout: 3 } ];

function lower_risk_level() {
  warning_1_users.forEach(function(element, index, object) {
    if (element.timeout > 0)
      element.timeout--;
    else
      object.splice(index, 1);
  });
  warning_2_users.forEach(function(element, index, object) {
    if (element.timeout > 0)
      element.timeout--;
    else
      object.splice(index, 1);
  });
  warning_3_users.forEach(function(element, index, object) {
    if (element.timeout > 0)
      element.timeout--;
    else
      object.splice(index, 1);
  });
  muted_users.forEach(function(element, index, object) {
    if (element.timeout > 0)
      element.timeout--;
    else
      object.splice(index, 1);
  });
}

setInterval(lower_risk_level, 60000);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  var needs_censor = false;
  var censor_level = 0;
  var array_level  = 0;

  for (let i = 0; i < censored_words.length; i++) {
    if (msg.content.toLowerCase().includes(censored_words[i])) {
      needs_censor = true;
    }
  }

  muted_users.forEach(element => {
    if (msg.author.toString() == element.username && element.timeout > 0) {
      needs_censor = true;
    }
  });

  if (needs_censor) {
    warning_1_users.forEach(element => {
      if (msg.author.toString() == element.username) {
        censor_level = 1;
        array_level = 1;
        element.timeout = 3;
      }
    });
    warning_2_users.forEach(element => {
      if (msg.author.toString() == element.username) {
        censor_level = 2;
        element.timeout = 3;
        array_level = 2;
      }
    });
    warning_3_users.forEach(element => {
      if (msg.author.toString() == element.username) {
        censor_level = 3;
        element.timeout = 3;
        array_level = 3;
      }
    });
    muted_users.forEach(element => {
      if (msg.author.toString() == element.username) {
        censor_level = 4;
        element.timeout = 3;
        array_level = 4;
      }
    });

    switch (censor_level) {
      case 0: {
        if (array_level < 1)
          warning_1_users.push({ username: msg.author.toString(), timeout: 3 }); 
        msg.reply(process.env.RESPONSE_MSG_1); 
        break;
      }
      case 1: {
        if (array_level < 2)
          warning_2_users.push({ username: msg.author.toString(), timeout: 3 }); 
        msg.reply(process.env.RESPONSE_MSG_2); 
        break;
      }
      case 2: {
        if (array_level < 3)
          warning_3_users.push({ username: msg.author.toString(), timeout: 3 }); 
        msg.reply(process.env.RESPONSE_MSG_3); 
        break;
      }
      case 3: {
        if (array_level < 4)
          muted_users.push({ username: msg.author.toString(), timeout: 3 }); 
        msg.reply(process.env.RESPONSE_MSG_4); 
        break;
      }
    }

    msg.delete();
  }
});

client.login(process.env.TOKEN);
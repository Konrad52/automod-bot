const Discord = require('discord.js');
const client = new Discord.Client();

const censored_words = process.env.CENSORED_WORDS.split(',');
const user_roles     = process.env.USER_ROLES    .split(',');
const excluded_roles = process.env.EXCLUDED_ROLES.split(',');
const pings = [];

let ping_channels = process.env.PING_CHANNELS.split(',');
ping_channels.forEach(ping => {
  let ping_split = ping_channels[ping].split('|');
  pings.push({voice: ping_split[0], text: ping_split[1]});
});

var warning_1_users = [ { username: '', timeout: 3 } ];
var warning_2_users = [ { username: '', timeout: 3 } ];
var warning_3_users = [ { username: '', timeout: 3 } ];
var muted_users     = [ { username: '', timeout: 3 } ];

function lower_risk_level() {
  warning_1_users.forEach(function(element, index, object) {
    if (element.timeout > 1)
      element.timeout--;
    else
      object.splice(index, 1);
  });
  warning_2_users.forEach(function(element, index, object) {
    if (element.timeout > 1)
      element.timeout--;
    else
      object.splice(index, 1);
  });
  warning_3_users.forEach(function(element, index, object) {
    if (element.timeout > 1)
      element.timeout--;
    else
      object.splice(index, 1);
  });
  muted_users.forEach(function(element, index, object) {
    if (element.timeout > 1)
      element.timeout--;
    else
      object.splice(index, 1);
  });
}

setInterval(lower_risk_level, 1000 * 60);

function dialy_report() {
  console.log('');
  console.log('===');
  console.log('Muted user count: ' + muted_users.length);
  console.log('===');
  console.log('');
}

setInterval(dialy_report, 1000 * 60 * 10);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  dialy_report();
});

client.on('message', msg => {
  user_roles.forEach(roleid => {
    if (msg.member.roles.cache.has(roleid))
    {
      if (msg.content.startsWith('!mute ')) {
        try {
          var timeout = msg.content.split(' ');
          var timeout_int = parseInt(timeout[2]);
          muted_users.push({ username: msg.mentions.users.first().toString(), timeout: timeout_int }); 
          msg.reply('A ' + timeout[1] + ' felhasználót sikeresen elnémítottad `' + timeout[2] + '` percre!');
        } catch (error) {
          console.error(error);
          msg.reply('A felhasználót nem sikerült elnémítani.');
        }
      } else
      if (msg.content.startsWith('!unmute ')) {
        var found = false;
        muted_users.forEach(function(element, index, object) {
          if (element.username = msg.mentions.users.first().toString()) 
          {
            element.timeout = 0;
            object.splice(index, 1);
            var timeout = msg.content.split(' ');
            msg.reply('A ' + timeout[1] + ' felhasználó némítását sikeresen feloldottad.');
            found = true;
          }
        });
        if (!found)
          msg.reply('A megadott felhasználó némításának feloldása sikertelen volt.');
      }
    }
  });

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
  
  excluded_roles.forEach(roleid => {
    if (msg.member.roles.cache.has(roleid))
      needs_censor = false;
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

    var reply;

    switch (censor_level) {
      case 0: {
        if (array_level < 1)
          warning_1_users.push({ username: msg.author.toString(), timeout: 3 }); 
        reply = process.env.RESPONSE_MSG_1; 
        break;
      }
      case 1: {
        if (array_level < 2)
          warning_2_users.push({ username: msg.author.toString(), timeout: 3 }); 
        reply = process.env.RESPONSE_MSG_2; 
        break;
      }
      case 2: {
        if (array_level < 3)
          warning_3_users.push({ username: msg.author.toString(), timeout: 3 }); 
        reply = process.env.RESPONSE_MSG_3; 
        break;
      }
      case 3: {
        if (array_level < 4)
          muted_users.push({ username: msg.author.toString(), timeout: 3 }); 
        reply = process.env.RESPONSE_MSG_4; 
        break;
      }
    }

    var embed = new Discord.MessageEmbed()
      .setColor('#ffaa00')
      .setAuthor('Szabálysértés')
      .setDescription(reply)
      .setTimestamp()
      .setFooter('- Automoderátor bot');

    if (censor_level < 4)
      msg.reply(embed);

    msg.delete();
  }
});

client.on('voiceStateUpdate', (oldState, newState) => {
  if (newState != undefined) {
    pings.forEach(ping => {
      if (newState.channelID == pings[ping].voice) {
        const channel = newState.guild.client.channels.cache.find(channel => channel.id == pings[ping].text);
        channel.send('A <@' + newState.member.id + '> belépett a <#' + newState.channelID + '> szobába!');
      }
    });
  }
});

client.login(process.env.TOKEN);
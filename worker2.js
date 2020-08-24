const Discord = require('discord.js');
var jsonbinIoApi = require("jsonbin-io-api")
const client = new Discord.Client();

const api = new jsonbinIoApi(process.env.JSONAPI);

var database = {};

function SaveFile() {
    api.updateBin({ 
        id: '5f429aa4514ec5112d0ca67b',
        data: database,
        versioning: false
    });
    console.log("UPDATE: " + JSON.stringify(database));
}

function LoadFile() {
    api.readBin({
        id: '5f429aa4514ec5112d0ca67b',
        version: 'latest'
    }).then(json => {
        database = json;
        console.log("LOAD: " + JSON.stringify(database));

        var channel = client.channels.cache.get('747043216871915542');
        channel.fetch();
        channel.messages.fetch(database['messageId']);
    });
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    LoadFile();
});

client.on('message', msg => {
    if (msg.member == null)
        return;

    if (msg.content.startsWith('!')) {
        if (msg.content.startsWith('!shophere')) {
            msg.channel.messages.fetch(database['messageId']).then(oldMessage => {
                if (oldMessage != undefined)
                    oldMessage.delete();
            });

            const embed = new Discord.MessageEmbed()
                .setColor('#9b00e9')
                .setTitle('Üdvözöllek!')
                .setDescription(`Ez itt a szerverünk leltára, ahonnan jutalmakat válthatsz ki magadnak drágakőért cserébe.\n
                                **Hogyan szerezhetsz drágakövet?**
                                Nos, pár feltétel után kapsz egyet a játékaid során:
                                > 1. Elérted a <@&720757882488094730> rangot.
                                > 2. Egy mérkőzés során elérted a 15 hősgyilkosságot.
                                > 3. Nem várhatod ki az 1v1 szakasz során hogy lejárjon az idő. 
                                >    (Az adott meccsben a csapattársaidnak kell a vezetőség felé megerősíteni hogy teljesítetted-e ezt vagy sem.)
                                > 4. A Facebook oldalunk követője kell hogy legyél.
                                \n**Honnan tudom hogy van-e éppen drágakövem?**
                                 - Reagálj ezzel az emotikonnal <:gemstone:747106274885238935> és egy privát üzenetben értesítést kapsz róla.
                                \n**Milyen jutalmaink vannak?**
                                <:glad_banned:747103629810466896> - Ezzel egy kibannolt hőst hozhatsz a következő mérkőzéseden.
                                <:gladi_reuse:747103629860929617> - Ezzel még **EGY** alkalommal játszahatod aznap az egyik hősödet.
                                <:gladi_item3:747103629504151673> - Ezzel az egyik mérkőzés 1v1 szakasza alatt kiválhaszthatod **EGYSZER** az ellenfeledet.\n
                                > ❗ __**Minden jutalom csak a vétel napján felhasználható!**__
                                > ❗ __**Egyszerre csak egy drágakő lehet egy felhasználónál! (Nem farmolható.)**__
                                \n__Bármelyik jutalom kiváltásához csak nyomd meg a megfelelő emotikont.__
                                \nSok szerencsét kívánok a jutalmak megszerzéséhez és mindekinek jó játékot!`)
                .setTimestamp()
                .setFooter('- Árus');

            msg.channel.send(embed).then(message => {
                database['messageId'] = message.id.toString();
                SaveFile();

                message.react('747106274885238935').then(() =>
                message.react('747103629810466896').then(() =>
                message.react('747103629860929617').then(() =>
                message.react('747103629504151673'))));
            });

            msg.delete();
        } else if (msg.content.startsWith('!give')) {
            if (msg.mentions.users.array().length == 0) {
                
                var embed = new Discord.MessageEmbed()
                .setColor('#aa0000')
                .setTitle('Sikertelen hozzáadás!')
                .setDescription(`Először említs meg valakit az üzenetedben!`)
                .setTimestamp()
                .setFooter('- Árus');

                msg.channel.send(embed);
            } else {
                var userId = msg.mentions.users.first().id.toString();

                var embed;

                if (database[userId] == undefined || database[userId] == 0) {
                    database[userId] = 1;
                    
                    SaveFile();

                    embed = new Discord.MessageEmbed()
                    .setColor('#00aa00')
                    .setTitle('Sikeres hozzáadás!')
                    .setDescription(`Mostmár <@`+ userId +`> felhaszáló rendelkezik egy drágakővel!`)
                    .setTimestamp()
                    .setFooter('- Árus');
                } else {
                    embed = new Discord.MessageEmbed()
                    .setColor('#aa0000')
                    .setTitle('Sikertelen hozzáadás!')
                    .setDescription(`<@`+ userId +`> már rendelkezett egy drágakővel!`)
                    .setTimestamp()
                    .setFooter('- Árus');
                }

                msg.channel.send(embed);
            }
        } else if (msg.content.startsWith('!take')) {
            if (msg.mentions.users.array().length == 0) {
                
                var embed = new Discord.MessageEmbed()
                .setColor('#aa0000')
                .setTitle('Sikertelen hozzáadás!')
                .setDescription(`Először említs meg valakit az üzenetedben!`)
                .setTimestamp()
                .setFooter('- Árus');

                msg.channel.send(embed);
                
                return;
            } else {
                var userId = msg.mentions.users.first().id.toString();

                var embed;

                if (database[userId] == 1) {
                    database[userId] = 0;
                    
                    SaveFile();

                    embed = new Discord.MessageEmbed()
                    .setColor('#00aa00')
                    .setTitle('Sikeres elvétel!')
                    .setDescription(`Mostmár <@`+ userId +`> felhaszáló nem rendelkezik drágakővel!`)
                    .setTimestamp()
                    .setFooter('- Árus');
                } else {
                    embed = new Discord.MessageEmbed()
                    .setColor('#aa0000')
                    .setTitle('Sikertelen elvétel!')
                    .setDescription(`<@`+ userId +`> még nem rendelkezett drágakővel!`)
                    .setTimestamp()
                    .setFooter('- Árus');
                }

                msg.channel.send(embed);
            }
        }
    }
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

    if (reaction.message.id.toString() == database['messageId'] && user.id != client.user.id) {
        let guild = reaction.message.guild;
        let member = guild.member(user);

        switch (reaction.emoji.id.toString()) {
            case '747106274885238935':
                var embed;    
            
                if (database[user.id.toString()] == 1) {
                    embed = new Discord.MessageEmbed()
                    .setColor('#ab00f9')
                    .setTitle('Üdvözöllek!')
                    .setDescription('Van egy drágaköved!')
                    .setTimestamp()
                    .setFooter('- Árus');
                } else {
                    embed = new Discord.MessageEmbed()
                    .setColor('#9b00e9')
                    .setTitle('Üdvözöllek!')
                    .setDescription('Nincs drágaköved!')
                    .setTimestamp()
                    .setFooter('- Árus');
                }

                user.send(embed);
                break;
            case '747103629810466896':
                var embed;    
            
                if (database[user.id.toString()] == 1) {
                    embed = new Discord.MessageEmbed()
                    .setColor('#ab00f9')
                    .setTitle('Gratulálunk '+member.displayName+'!')
                    .setDescription(`Sikeresen feloldottad a jutalmad, 
                                    amelyet a mai napon a legközelebbi meccseden használhatsz fel!
                                    \nJutalom típusa: <:glad_banned:747103629810466896> - Egy bannolt hős hozása.
                                    \nJó játékot!`)
                    .setTimestamp()
                    .setFooter('- Árus');

                    database[user.id.toString()] = 0;
                    SaveFile();
                    client.channels.cache.get('747046212045111307').send(embed);
                } else {
                    embed = new Discord.MessageEmbed()
                    .setColor('#9b00e9')
                    .setTitle('Üdvözöllek!')
                    .setDescription('Nincs drágaköved, hogy kiváltsd ezt a jutalmat!')
                    .setTimestamp()
                    .setFooter('- Árus');

                    user.send(embed);
                }
                break;
            case '747103629860929617':
                var embed;    
            
                if (database[user.id.toString()] == 1) {
                    embed = new Discord.MessageEmbed()
                    .setColor('#ab00f9')
                    .setTitle('Gratulálunk '+member.displayName+'!')
                    .setDescription(`Sikeresen feloldottad a jutalmad, 
                                    amelyet a mai napon a legközelebbi meccseden használhatsz fel!
                                    \nJutalom típusa: <:gladi_reuse:747103629860929617> - Egy hős újraválasztása 1 alkalommal.
                                    \nJó játékot!`)
                    .setTimestamp()
                    .setFooter('- Árus');

                    database[user.id.toString()] = 0;
                    SaveFile();
                    client.channels.cache.get('747046212045111307').send(embed);
                } else {
                    embed = new Discord.MessageEmbed()
                    .setColor('#9b00e9')
                    .setTitle('Üdvözöllek!')
                    .setDescription('Nincs drágaköved, hogy kiváltsd ezt a jutalmat!')
                    .setTimestamp()
                    .setFooter('- Árus');

                    user.send(embed);
                }
                break;
            case '747103629504151673':
                var embed;    
            
                if (database[user.id.toString()] == 1) {
                    embed = new Discord.MessageEmbed()
                    .setColor('#ab00f9')
                    .setTitle('Gratulálunk '+member.displayName+'!')
                    .setDescription(`Sikeresen feloldottad a jutalmad, 
                                    amelyet a mai napon a legközelebbi meccseden használhatsz fel!
                                    \nJutalom típusa: <:gladi_item3:747103629504151673> - 1v1 ellenfél kiválasztása.
                                    \nJó játékot!`)
                    .setTimestamp()
                    .setFooter('- Árus');

                    database[user.id.toString()] = 0;
                    SaveFile();
                    client.channels.cache.get('747046212045111307').send(embed);
                } else {
                    embed = new Discord.MessageEmbed()
                    .setColor('#9b00e9')
                    .setTitle('Üdvözöllek!')
                    .setDescription('Nincs drágaköved, hogy kiváltsd ezt a jutalmat!')
                    .setTimestamp()
                    .setFooter('- Árus');

                    user.send(embed);
                }
                break;
        }
        var message = reaction.message;

        message.reactions.removeAll();
        
        message.react('747106274885238935').then(() =>
        message.react('747103629810466896').then(() =>
        message.react('747103629860929617').then(() =>
        message.react('747103629504151673'))));
    }
});

client.login(process.env.TOKEN2);
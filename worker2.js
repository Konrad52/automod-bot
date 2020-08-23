const Discord = require('discord.js');
var fs = require("fs");
const client = new Discord.Client();

var database = {};

function SaveFile() {
    fs.writeFileSync('./users.json', JSON.stringify(database));
}

function LoadFile() {
    try {
        if (fs.existsSync("./users.json")) {
            database = JSON.parse(fs.readFileSync("./users.json"));
        }
    } catch(err) {
        fs.writeFileSync('./users.json', "{}");
        LoadFile();   
    }
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
            const embed = new Discord.MessageEmbed()
                .setColor('#ffaa00')
                .setTitle('Üdvözöllek!')
                .setDescription(`Ez itt a szerverünk leltára, ahonnan jutalmakat válthatsz ki magadnak drágakőért cserébe.\n
                                **Hogyan szerezhetsz drágakövet?**
                                Nos, pár feltétel után kapsz egyet a játékaid során:
                                > 1. Elérted a <@&720757882488094730> rangot.
                                > 2. Egy mérkőzés során elérted a 15 hősgyilkosságot.
                                > 3. <>
                                \n**Honnan tudom hogy van-e éppen drágakövem?**
                                 - Reagálj ezzel az emotikonnal <:gemstone:747106274885238935> és egy privát üzenetben elküldöm.
                                \n**Miféle jutalmaink vannak?**
                                <:glad_banned:747103629810466896> - Ezzel egy kibannolt hőst hozhatsz a következő mérkőzéseden.
                                <:gladi_reuse:747103629860929617> - Ezzel még **EGY** alkalommal játszahatod aznap az egyik hősödet.
                                <:gladi_item3:747103629504151673> - Ezzel az egyik mérkőzés 1v1 szakasza alatt kiválhaszthatod **EGYSZER** az ellenfeledet.\n
                                > ❗ __**Minden jutalom csak a vétel napján felhasználható!**__
                                > ❗ __**Egyszerre csak egy drágakő lehet egy felhasználónál! (Nem farmolható.)**__
                                \n__Bármelyik jutalom kiváltásához csak nyomd meg a megfelelő emotikont.__
                                \nSok szerencsét kívánok a jutalmakat megszerzéséhez és mindekinek jó játékot!`)
                .setTimestamp()
                .setFooter('- Árus');

            msg.channel.send(embed).then(message => {
                message.react('747106274885238935').then(() =>
                message.react('747103629810466896').then(() =>
                message.react('747103629860929617').then(() =>
                message.react('747103629504151673'))));
            });

            msg.delete();
        } else if (msg.content.startsWith('!give')) {
            var userId = msg.mentions.first().id.toString();

            const embed;

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
    
    if (reaction.message.content.includes('Teszt'))
        reaction.message.react(client.emojis.cache.get("745207133657890856"));
});

client.login(process.env.TOKEN2);
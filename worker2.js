const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.member == null)
        return;

    if (msg.content.startsWith('!')) {
        if (msg.content.startsWith('!shophere')) {
            const embed = new Discord.MessageEmbed()
                .setColor('#ffaa00')
                .setTitle('Gladiátor Leltár')
                .setDescription(`Üdvözöllek!\n\n
                                Ez itt a szerverünk leltára, ahonnan tárgyakat vehetsz ki\n
                                magadnak égkövekért cserébe.\n\n
                                Hogy honnan szerezhetsz égkövet?\n
                                Nos, pár feltétel után kapsz egyet-egyet a játékaid után:\n
                                 1. - Egy mérkőzés során elérted a 15 hősgyilkosságot.\n
                                 2. - <>\n
                                 3. - <>\n
                                \nHonnan tudom hogy mennyi érmém van?\n
                                 - Reagálj ezzel az emotikonnal <>, és elmondom neked.\n 
                                \nMiféle tárgyink vannak?\n
                                <baltaEmoji> - Ezzel egy kibannolt hőst hozhatsz a következő mérkőzéseden.\n
                                <> - <>\n
                                <> - <>\n
                                \n! Minden tárgy csak a vétel napján felhasználható !\n
                                Bármelyiknek a megvételéhez csak nyomd meg a megfelelő emotikont.\n
                                \nSok szerencsét kívánok a tárgyak megszerzéséhez és mindekinek jó játékot!`)
                .setTimestamp()
                .setFooter('- Árus', 'https://cdn.discordapp.com/app-icons/747074877936369747/b581530bac729aea32d2fd655deee5ef.png');

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
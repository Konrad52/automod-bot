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
                .setDescription(`**   Üdvözöllek!**\n
                                Ez itt a szerverünk leltára, ahonnan tárgyakat vehetsz ki magadnak égkövekért cserébe.
                                Hogy honnan szerezhetsz égkövet?
                                Nos, pár feltétel után kapsz egyet-egyet a játékaid után:
                                > 1. Elérted a @⚔️Gladiátor⚔️ rangot.
                                > 2. Egy mérkőzés során elérted a 15 hősgyilkosságot.
                                > 3. <>
                                \nHonnan tudom hogy mennyi égkövem van?
                                 - Reagálj ezzel az emotikonnal <:egko:747096872975597570> és elmondom neked.
                                \nMiféle tárgyink vannak?
                                <baltaEmoji> - Ezzel egy kibannolt hőst hozhatsz a következő mérkőzéseden.
                                <> - <>
                                <> - <>
                                \n❗ Minden tárgy csak a vétel napján felhasználható ❗
                                Bármelyik tágynak a megvételéhez csak nyomd meg a megfelelő emotikont.
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
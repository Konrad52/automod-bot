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
                                Ez itt a szerverünk leltára, ahonnan jutalmakat válthatsz ki magadnak égkőért cserébe.\n
                                **Hogy honnan szerezhetsz égkövet?**
                                Nos, pár feltétel után kapsz egyet a játékaid után:
                                > 1. Elérted a <@&720757882488094730> rangot.
                                > 2. Egy mérkőzés során elérted a 15 hősgyilkosságot.
                                > 3. <>
                                \n**Honnan tudom hogy van-e éppen égkövem?**
                                 - Reagálj ezzel az emotikonnal <:egko:747103628619415615> és egy privát üzenetben elküldöm.
                                \n**Miféle jutalmaink vannak?**
                                <:glad_banned:747103629810466896> - Ezzel egy kibannolt hőst hozhatsz a következő mérkőzéseden.
                                <:gladi_reuse:747103629860929617> - Ezzel még **EGY** alkalommal játszahatod aznap az egyik hősödet.
                                <:gladi_item3:747103629504151673> - Valami \`:P\`\n
                                > ❗ __**Minden tárgy csak a vétel napján felhasználható**__
                                > ❗ __**Egyszerre csak egy égkő lehet egy felhasználónál.**__
                                \nBármelyik tágynak a megvételéhez csak nyomd meg a megfelelő emotikont.
                                \nSok szerencsét kívánok a tárgyak megszerzéséhez és mindekinek jó játékot!`)
                .setTimestamp()
                .setFooter('- Árus', 'https://cdn.discordapp.com/app-icons/747074877936369747/b581530bac729aea32d2fd655deee5ef.png');

            msg.channel.send(embed);

            msg.react('747103628619415615').then(() =>
            msg.react('747103629810466896').then(() =>
            msg.react('747103629860929617').then(() =>
            msg.react('747103629504151673'))));
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
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const embeds = require('../../src/embeds.json');
const colors = require('colors')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('View the bot\'s information.'),
	async execute(interaction) {
        try {
            const footerMsg = [
                "🧃 Hydrated by juice boxes!",
                "🧃Hydration level: 87%",
                "🧃Apple juice is better than grape juice!",
                "🧃Have you seen my juice box?",
                "🧃Recipe: 1 part code, 2 parts juice!",
                "🧃These are really corny, I know."
            ]

            const BotEmbed = new EmbedBuilder()
		    	.setTitle(`🧃 ${interaction.client.user.username}`)
		    	.setColor(embeds.default.color)
		    	.setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`>>> **Howdy!** I'm Sipperoid - your juice-powered Discord Bot!\nI'm still sippin on code, making my own juice, so expect updates!\nJoin my Discord server to suggest some flavors!\n\n`)
                .setFields([
                    { name: '🌐 **Servers**', value: `\`${interaction.client.guilds.cache.size}\``, inline: true },
                    { name: '👥 **Users**', value: `\`${interaction.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}\``, inline: true },
                    { name: '🏓 **Ping**', value: `\`${Math.round(interaction.client.ws.ping)}ms\``, inline: true },

                    { name: '📦 **Version**', value: `\`v0.1\``, inline: true },
                    { name: '🤖 **Creator**', value: `Darkslaye`, inline: true },
                    { name: '🎨 **Artists**', value: "> `Character Artist:` [**Ryth Behemoth**](https://vgen.co/Ryth)\n> `Discord Banner:` **Tyrant Princess**", inline: false }
                ])
                .setFooter({ text: footerMsg[Math.floor(Math.random() * footerMsg.length)] })

            const ServerButton = new ButtonBuilder()
                .setURL('https://discord.gg/Gz79s9VU9B')
                .setLabel('Join my Discord Server!')
                .setStyle(ButtonStyle.Link)

            const TrelloButton = new ButtonBuilder()
                .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
                .setLabel('Trello Page!')
                .setStyle(ButtonStyle.Link)

            const row = new ActionRowBuilder()
                .addComponents(ServerButton, TrelloButton);

		    await interaction.reply({ 
                embeds: [BotEmbed],
                components: [row]
            })
        } catch (err) {
			console.error('Error sending embeded response:'.red, err, );
			const EmbedError = new EmbedBuilder()
				.setTitle(embeds.error.title)
				.setColor(embeds.error.color)
				.setDescription(embeds.error.description)
				.setFooter({ text: embeds.error.footer })
			interaction.reply({ embeds: [EmbedError] })
        }
	}
}
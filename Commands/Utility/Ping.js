const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const embeds = require('../../src/embeds.json');
const colors = require('colors')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with the bot\' API ping.'),
	async execute(interaction) {
		try {
			const msgPing = Date.now() - interaction.createdTimestamp;
        	const apiPing = interaction.client.ws.ping;
			const PingEmbed = new EmbedBuilder()
				.setTitle(`Pong!`)
				.setColor("#893BFF")
				.setDescription(`API Latency is **${apiPing}ms.**\nMessage Latency is **${msgPing}ms.**`)
			await interaction.reply({ embeds: [PingEmbed] })
		} catch (err) {
			console.error('Error sending embeded response:'.red, err);
			const PingEmbedError = new EmbedBuilder()
				.setTitle("Error")
				.setColor("Red")
				.setDescription("An error occurred while executing the command.\nError has been reported.")
				.setFooter({ text: "Please try again later. . ." })
			await interaction.reply({ embeds: [PingEmbedError], ephemeral: true });
		}
	},
};

// This will not work. 
// Update the code.
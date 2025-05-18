const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with the bot\' API ping.'),
	async execute(interaction) {
        const apiPing = interaction.client.ws.ping;
        await interaction.reply(`Pong! API Latency is **${apiPing}ms.**`)


    },
};
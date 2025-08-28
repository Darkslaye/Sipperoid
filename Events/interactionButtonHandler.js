const { Events, GuildChannelManager, EmbedBuilder } = require('discord.js');
const colors = require('colors');
const { execute } = require('./MessageCreate');

module.exports = {
    name: Events.InteractionCreate, 
    once: false,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'beginVerificationProcess') {
            // Create the ticket channel and await its creation
            const newTicketChannel = await interaction.guild.channels.create({
                name: "📜╟-◦-" + interaction.member.displayName + "-ticket"
            });

            const verificationMessageEmbed = new EmbedBuilder()
                .setColor("#666666")
                .setTitle(`Verification Ticket - ${interaction.member.displayName}`)
                .setThumbnail(interaction.guild.iconURL())
                .setDescription(`Howdy ${interaction.member}, if you're looking to join the clan, answer the questions below while we get to you!`
                    + "\n**1. What is your Clash Tag?**\n**2. Why did you leave your previous clan?**\n**3. How do we keep you engaged?**\n---------------------------------------------\nIf you're looking to visit, please introduce yourself instead!")

            await newTicketChannel.send({ embeds: [verificationMessageEmbed] });

            await interaction.reply({ content: `Ticket channel created. Please visit <#${newTicketChannel.id}>.`, ephemeral: true });
        }

        if (interaction.customId === 'beginVerificationSkip') {
            await interaction.member.kick()
        }

    }
}
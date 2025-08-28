// Needs to be fixed.

const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const colors = require('colors');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('View the bot\'s information.'),
    async execute(interaction) {
        try {
            // Array for randomized Footer Messages
            const footerMessages = [
                "🧃 Hydrated by juice boxes!",
                "🧃 Hydration level: 87%",
                "🧃 Apple juice is better than grape juice!",
                "🧃 Have you seen my juice box?",
                "🧃 Recipe: 1 part code, 2 parts juice!",
                "🧃 Crafted with Love and Juice!"
            ];

            // Statistics for API and uptime data.
            const msgPing = Date.now() - interaction.createdTimestamp;
            const apiPing = interaction.client.ws.ping;
            const uptimeSeconds = Math.floor(process.uptime());
            const uptimeString = [
                Math.floor(uptimeSeconds / 3600) + "h",
                Math.floor((uptimeSeconds % 3600) / 60) + "m",
                (uptimeSeconds % 60) + "s"
            ].join(" ");

            const BotEmbed = new EmbedBuilder()
                .setAuthor({
                    name: interaction.client.user.username,
                    iconURL: interaction.client.user.displayAvatarURL({ dynamic: true })
                })
                .setColor("#FF3B3B") // Hardcoded color
                .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(
                    "**Howdy!** I'm Sipperoid, your juice-powered Discord bot!\n" +
                    "Still sippin' on code, so expect updates.\n" +
                    "Join my server to suggest flavors!"
                )
                .addFields(
                    {
                        name: "🍇 Stats",
                        value: `> **➤ Servers:** \`${interaction.client.guilds.cache.size}\`\n> **➤ Members:** \`${interaction.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}\``,
                        inline: false
                    },
                    {
                        name: "📦 Version",
                        value: `> **➤ Version:** \`v0.1\`\n> **➤ Developer:** \`Darkslaye\``,
                        inline: false
                    },
                    {
                        name: "⏱️ Performance",
                        value: `> **➤ API Ping:** \`${apiPing}ms\`\n> **➤ Msg Ping:** \`${msgPing}ms\`\n> **➤ Uptime:** \`${uptimeString}\``,
                        inline: false
                    },
                    {
                        name: "🎨 Artists",
                        value: `> **➤ Character:** [Ryth Behemoth](https://vgen.co/Ryth)\n> **➤ Banner:** **Tyrant Princess**`,
                        inline: false
                    }
                )
                .setFooter({
                    text: footerMessages[Math.floor(Math.random() * footerMessages.length)]
                });

            // Buttons
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setURL(process.env.DiscordServerInviteLink)
                    .setLabel('Join Server')
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setURL(process.env.BotInviteLink)
                    .setLabel('Invite Bot')
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setURL(process.env.TrelloLink)
                    .setLabel('Trello')
                    .setStyle(ButtonStyle.Link)
            );

            await interaction.reply({
                embeds: [BotEmbed],
                components: [row]
            });
        } catch (err) {
            console.error('Error in /info command:'.red, err);
            const errorEmbed = new EmbedBuilder()
                .setTitle("Error")
                .setColor("Red")
                .setDescription("An error occurred while executing the command.\nError has been reported.");

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};
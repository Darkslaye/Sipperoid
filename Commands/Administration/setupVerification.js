const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const embeds = require('../../src/embeds.json');
const colors = require('colors');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// We can utilize subcommands.
// https://stackoverflow.com/questions/71604166/how-to-create-a-slash-command-with-spacing-in-the-name



module.exports = {
    data: new SlashCommandBuilder()
        .setName('create verification')
        .setDescription('Creates a verification message.'),
    async execute(interaction) {
        
        const verificationEmbed = new EmbedBuilder()
            .setColor("#FF3B3B")
            .setTitle("Verification")
            .setThumbnail(interaction.guild.iconURL())
            .setImage("https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmU3N2dwZnhwbmtucXo2eWJ6czFsdjA0MWV6b282anR0eGJicXI2YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYC0LajbaPoEADu/giphy.gif")
            .setDescription("Howdy! Welcome to our Discord server!"
                        + "\nTo access the server, tap the 'Begin Verification' button below to create a ticket channel.")

            const beginVerificationProcess = new ButtonBuilder()
                .setCustomId("beginVerificationProcess")
                .setLabel("Begin Verification")
                .setStyle(ButtonStyle.Primary)

            const beginVerificationSkip = new ButtonBuilder()
                .setCustomId("beginVerficationSkip")
                .setLabel("Skip Verification")
                .setStyle(ButtonStyle.Danger)

            const row = new ActionRowBuilder()
                .addComponents(beginVerificationProcess, beginVerificationSkip)

            const verificationMessage = await interaction.channel.send({ 
                embeds: [verificationEmbed], 
                components: [row]
            })

            let dataObj = {
                Verification:
                {
                    channelID: interaction.channel.id,
                    messageID: verificationMessage.id
                }
            }

            let json = JSON.stringify(dataObj, null, 2);
            const dirPath = path.join(__dirname, `../../Database/Server/${interaction.guild.id}`);
            const filePath = path.join(dirPath, 'verificationMessage.json');
            if (!fs.existsSync(dirPath)){
                fs.mkdirSync(dirPath, { recursive: true });
            }
            fs.writeFile(filePath, json, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                } else {
                    console.log('Verification message data saved successfully.');
                }
            });
            

    }
};
const { SlashCommandBuilder, ChannelType, PermissionsBitField, ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clash')
        .setDescription('Creates voice channels for Clash of Clans countdown monitor.'),
    async execute(interaction) {

//        // Defining the path to our server data.
//        const filePath = path.join(__dirname, `../../Database/Server/${interaction.guild.id}.json`);
//
//        let serverData = {};
//        if (fs.existsSync(filePath)) {
//            serverData = JSON.parse(fs.readFileSync(filePath));
//        } else {
//            console.log(`No data file found for guild: ${interaction.guild.name} | ${interaction.guild.id}. Creating a new one.`);
//        }
//
//        const ClashofClansData = {
//            EndofSeason: null,
//            Raid: null,
//            ClanWarLeague: null,
//        }














        if (interaction.user.id != '622532185731366932') {
            console.log('This command is restricted to developers.')
            const errorEmbed = new EmbedBuilder()
                .setTitle('❌ Permission Denied')
                .setColor('Red')
                .setDescription('You do not have permission to use this command.')
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            return;
        }








    }
}





        
//        if (message.author.bot) return;
//
//        if (message.content != 'water') return;
//
//        if (message.author.id != '622532185731366932') {
//            console.log('This command is restricted to developers.')
//            await message.reply('You do not have permission to use this command.', { ephemeral: false });
//            return;
//        }
//
//        try {
//            // yoinking data from the database
//            let ClashChannels = await db.get(`Server.${message.guild.id}.ClashofClans`);
//
//            // function to delete the old voice channels upon detection
//            const deleteChannelIfExists = async (channelId, dbPath) => {
//                const DetectChannel = message.guild.channels.cache.get(channelId);
//                if (DetectChannel) {
//                    console.log(`Deleting channel: ${DetectChannel.name}`);
//                    await DetectChannel.delete();
//                }
//                await db.delete(dbPath);
//            };
//
//            if (ClashChannels) {
//                if (ClashChannels.EndofSeason) {
//                    await deleteChannelIfExists(ClashChannels.EndofSeason, `Server.${message.guild.id}.ClashofClans.EndofSeason`);
//                }
//                if (ClashChannels.Raid) {
//                    await deleteChannelIfExists(ClashChannels.Raid, `Server.${message.guild.id}.ClashofClans.Raid`);
//                }
//                if (ClashChannels.ClanWarLeague) {
//                    await deleteChannelIfExists(ClashChannels.ClanWarLeague, `Server.${message.guild.id}.ClashofClans.ClanWarLeague`);
//                }
//            }
//
//            // function that creates the voice channels
//            const createVoiceChannel = async (name, dbPath) => {
//                const newChannel = await message.guild.channels.create({
//                    name,
//                    type: ChannelType.GuildVoice,
//                    permissionOverwrites: [
//                        {
//                            id: message.guild.roles.everyone.id,
//                            deny: [PermissionsBitField.Flags.Connect],
//                        },
//                    ],
//                });
//                await db.set(dbPath, newChannel.id);
//                return newChannel;
//            };
//
//            await createVoiceChannel('EoS in', `Server.${message.guild.id}.ClashofClans.EndofSeason`);
//            await createVoiceChannel('Raids in', `Server.${message.guild.id}.ClashofClans.Raid`);
//            await createVoiceChannel('CWL in', `Server.${message.guild.id}.ClashofClans.ClanWarLeague`);
//
//            ServerConfiguration = await db.get(`Server.${message.guild.id}.ClashofClans.isActive`);
//            // Is the server simply restarting the channels, or is it a new server?
//            if (!ServerConfiguration) {
//                db.set(`Server.${message.guild.id}.ClashofClans.isActive`, true)
//            }
//            await message.reply('Channels created successfully.', { ephemeral: false });
//
//
//        } catch (error) {
//            console.error('Error creating channel:', error);
//            await message.reply('There was an error creating the channels.', { ephemeral: false });
//        }
//    },
//};
//






//        const confirmationEmbed = new EmbedBuilder()
//            .setTitle('Create Voice Channels')
//            .setColor('Blurple')
//            .setDescription('The following channels will be created:\n`End of Season`\n`Raids`\n`Clan War League`\n\n**Would you like to proceed?**')
//
//        const row = new ActionRowBuilder()
//            .addComponents(
//                new ButtonBuilder()
//                    .setLabel('Confirm')
//                    .setStyle('Primary')
//                    .setCustomId('confirm'),
//                new ButtonBuilder()
//                    .setLabel('Cancel')
//                    .setStyle('Danger')
//                    .setCustomId('cancel'),
//            );
//        
//        await interaction.reply({ embeds: [confirmationEmbed], components: [row] });
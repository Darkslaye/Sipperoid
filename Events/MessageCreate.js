const { Events, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const colors = require('colors');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        if (message.author.bot) return;
        if (message.content != 'Create Voice Channel') return;

        if (message.author.id != '622532185731366932') return;

        const createVoiceChannel = async (name) => {
            const newChannel = await message.guild.channels.create({
                name,
                type: ChannelType.GuildVoice,
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone.id,
                        deny: [PermissionsBitField.Flags.Connect],
                    },
                ],
            });
            console.log(`${newChannel} has been created.`);
            return newChannel.id; // Return the channel ID
        };


        const endOfSeasonChannelId = await createVoiceChannel('EoS in');
        const raidChannelId = await createVoiceChannel('Raids in');
        const clanWarLeagueChannelId = await createVoiceChannel('CWL in');      



        // Log the channel IDs to verify they are not undefined
        console.log('End of Season Channel ID:', endOfSeasonChannelId);
        console.log('Raid Channel ID:', raidChannelId);
        console.log('Clan War League Channel ID:', clanWarLeagueChannelId);



        // Defining the path to our server data.
        const filePath = path.join(__dirname, `../Database/Server/${message.guild.id}.json`);

        let serverData = {};
        if (fs.existsSync(filePath)) {
            serverData = JSON.parse(fs.readFileSync(filePath));
        } else {
            console.log(`No data file found for guild: ${message.guild.name} | ${message.guild.id}. Creating a new one.`);
        }

        const ClashofClansData = {
            EndofSeason: endOfSeasonChannelId,
            Raid: raidChannelId,
            ClanWarLeague: clanWarLeagueChannelId
        };

        // 
        if (!serverData.Settings) serverData.Settings = {};
        serverData.Settings.ClashofClans = ClashofClansData;

        fs.writeFileSync(filePath, JSON.stringify(serverData, null, 4));
        console.log('Server information has been updated.');

        // Is the server active?
        // If it is not, then we need to create the voice channels and set it to active.
        // If it is, simply delete and create the voice channels.
        ClashofClansData
        try {

        } catch (error) {
            console.error('Error creating channel:', error);
            await message.reply('There was an error creating the channels.', { ephemeral: false})
        }
        return;







        // Ignore everything down here!
        try {
            let ClashChannels = await db.get(`Server.${message.guild.id}.ClashofClans`); // Getting the data from the database.

            // function to delete the old voice channels upon detection
            const deleteChannelIfExists = async (channelId, dbPath) => {
                const DetectChannel = message.guild.channels.cache.get(channelId);
                if (DetectChannel) {
                    console.log(`Deleting channel: ${DetectChannel.name}`);
                    await DetectChannel.delete();
                }
                await db.delete(dbPath);
            };

            if (ClashChannels) {
                if (ClashChannels.EndofSeason) {
                    await deleteChannelIfExists(ClashChannels.EndofSeason, `Server.${message.guild.id}.ClashofClans.EndofSeason`);
                }
                if (ClashChannels.Raid) {
                    await deleteChannelIfExists(ClashChannels.Raid, `Server.${message.guild.id}.ClashofClans.Raid`);
                }
                if (ClashChannels.ClanWarLeague) {
                    await deleteChannelIfExists(ClashChannels.ClanWarLeague, `Server.${message.guild.id}.ClashofClans.ClanWarLeague`);
                }
            }

            // Function to create the voice channels, automatically locking the permissions.
            const createVoiceChannel = async (name, dbPath) => {
                const newChannel = await message.guild.channels.create({
                    name,
                    type: ChannelType.GuildVoice,
                    permissionOverwrites: [
                        {
                            id: message.guild.roles.everyone.id,
                            deny: [PermissionsBitField.Flags.Connect],
                        },
                    ],
                });
                await db.set(dbPath, newChannel.id);
                return newChannel;
            };

            // Creating the data for the voice chats to be sent to the function and created in the database.
            await createVoiceChannel('EoS in', `Server.${message.guild.id}.ClashofClans.EndofSeason`);
            await createVoiceChannel('Raids in', `Server.${message.guild.id}.ClashofClans.Raid`);
            await createVoiceChannel('CWL in', `Server.${message.guild.id}.ClashofClans.ClanWarLeague`);

        } catch (error) {
            console.error('Error creating channel:', error);
            await message.reply('There was an error creating the channels.', { ephemeral: false})
        }
    }
}


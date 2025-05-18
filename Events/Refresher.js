const fs = require('node:fs');
const path = require('node:path');

const refresher = async (client) => {

    console.log("Updating timers...");

    const databasePath = path.join(__dirname, '../Database/Server');
    const files = fs.readdirSync(databasePath);

    for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const filePath = path.join(databasePath, file);
        let serverData;

        try {
            serverData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
            console.log(`Error reading ${file}:` + error);
            continue;
        }

        const guildId = file.replace('.json', '');
        const guild = client.guilds.cache.get(guildId);

        // If the bot is no longer in this server, delete its database.
        if (!guild) { 
            console.log(`Bot is no longer in guild ${guildId}. Deleteing its database.`)
            fs.unlinkSync(filePath);
            continue;
        }

        const clashData = serverData.Settings?.ClashofClans;
        if (!clashData) continue;

        const { EndofSeason, Raid, ClanWarLeague } = clashData;

        if (EndofSeason == null && Raid == null && ClanWarLeague == null) continue;
        if (!EndofSeason && !Raid && !ClanWarLeague) {
            console.log(`${guildId} | Invalid data. Resetting...`.yellow);

            const defaultData = {
                Settings: {
                    ClashofClans: {
                        EndofSeason: null,
                        Raid: null,
                        ClanWarLeague: null
                    }
                }
            };

            fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 4));
            console.log(`${guildId} | Database reset to default.`.green);
            continue;
        }

        // Function to rename channels.
        const renameChannel = async (channelId, newName, guild, guildId, filePath, serverData) => {
            try {
                const channel = await guild.channels.fetch(channelId).catch(() => null);

                if (!channel) { 
                    console.log(`${guildId} | Channel ${channelId} not found, removing from database.`.yellow);
                    if (serverData.Settings.ClashofClans) {
                        for (const key in serverData.Settings.ClashofClans) {
                            if (serverData.Settings.ClashofClans[key] === channelId) {
                                serverData.Settings.ClashofClans[key] = null;
                            }
                        }
                        fs.writeFileSync(filePath, JSON.stringify(serverData, null, 4));
                    }
                    return;
                }
                await channel.setName(newName);
            } catch (error) {
                console.error(`${guildId} | Error renaming ${newName} channel.`.red, error);
            }
        };




    
        // Do here

        if (EndofSeason) {
            await renameChannel(EndofSeason, 'EoS in TIME', guild, guildId, filePath, serverData);
        }
        if (Raid) { 
            await renameChannel(Raid, 'Raids in TIME', guild, guildId, filePath, serverData);
        }
        if (ClanWarLeague) { 
            await renameChannel(ClanWarLeague, 'CWL in TIME', guild, guildId, filePath, serverData);
        }
    }
}

module.exports = refresher;
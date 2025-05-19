const fs = require('node:fs');
const path = require('node:path');
const timeUtil = require('../timeUtil');

const refresher = async (client) => {

    console.log("Updating timers...");

    try {
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

            // Helper to format ms to "xD yH" or "yH zM"
            function formatTime(ms) {
                if (ms < 0) ms = 0;
                const totalMinutes = Math.floor(ms / (60 * 1000));
                const days = Math.floor(totalMinutes / (60 * 24));
                const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
                const minutes = totalMinutes % 60;
                let str = '';
                if (days > 0) {
                    str += `${days}D `;
                    str += `${hours}H`;
                } else {
                    if (hours > 0) str += `${hours}H `;
                    str += `${minutes}M`;
                }
                return str.trim();
            }

            // Do here
            if (EndofSeason) {
                const eosMs = timeUtil.getTimeUntilEndingEoS();
                const eosName = `EoS ends in ${formatTime(eosMs)}`;
                await renameChannel(EndofSeason, eosName, guild, guildId, filePath, serverData);
            }

            if (Raid) {
                const raidStartMs = timeUtil.getTimeUntilNextRaid();
                const raidEndMs = timeUtil.getTimeUntilEndingRaid();
                let raidName, inRaid;
                if (raidStartMs > 0 && raidStartMs < raidEndMs) {
                    raidName = `Raid starts in ${formatTime(raidStartMs)}`;
                    inRaid = false;
                } else {
                    raidName = `Raid ends in ${formatTime(raidEndMs)}`;
                    inRaid = true;
                }
                await renameChannel(Raid, raidName, guild, guildId, filePath, serverData);
            }

            if (ClanWarLeague) {
                const cwlStartMs = timeUtil.getTimeUntilNextCWL();
                const cwlEndMs = timeUtil.getTimeUntilEndingCWL();
                let cwlName, inCWL;
                if (cwlStartMs > 0 && cwlStartMs < cwlEndMs) {
                    cwlName = `CWL starts in ${formatTime(cwlStartMs)}`;
                    inCWL = false;
                } else {
                    cwlName = `CWL ends in ${formatTime(cwlEndMs)}`;
                    inCWL = true;
                }
                await renameChannel(ClanWarLeague, cwlName, guild, guildId, filePath, serverData);
            }
        }
    } catch (err) {
        console.error("Refresher main loop error:", err);
    }
}

module.exports = refresher;
const { Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const colors = require('colors');

module.exports = {
	name: Events.GuildCreate,
	once: false,
	async execute(guild) {
        console.log(`Joined a new guild: ${guild.name}`.green);
        const guildId = guild.id;
        const filePath = path.join(__dirname, `../Database/Server/${guild.id}.json`)

        if (!fs.existsSync(filePath)) {
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
            console.log(`Created a new data file for guild: ${guild.name} | ${guild.id}`.green);
        } else {
            console.log(`Data file already exists for guild: ${guild.name} | ${guild.id}`.yellow);
        }

        // There's certain data we don't want deleted.


    },
};

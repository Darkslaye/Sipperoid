const { Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const colors = require('colors');

module.exports = {
    name: Events.GuildDelete,
    once: false,
    async execute(guild) {
        const guildId = guild.id;
        const filePath = path.join(__dirname, `../Database/Server/${guildId}.json`);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted data file for guild: ${guild.name} | ${guild.id}`.red);
        }
    },
};

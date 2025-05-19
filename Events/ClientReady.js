const { Events } = require('discord.js');
const colors = require('colors');
const refresher = require('./Refresher.js');
const config = require('../config.json');

function msUntilNext49MinuteMark() {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ms = now.getMilliseconds();

    let nextMinute = minutes + (5 - (minutes % 5)) - 1; // Round down to the nearest 5
    if (minutes % 5 >= 4) nextMinute += 5; // Round up to the next 5
    nextMinute = nextMinute % 60; 
    let deltaMinutes = nextMinute - minutes; // Calculate the difference in minutes
    if (deltaMinutes <= 0) deltaMinutes += 5; // Is it positive?
    const msUntil = (deltaMinutes * 60 * 1000) - (seconds * 1000) - ms; // Calculate the total milliseconds until the next 5 minute mark.
    return msUntil; 
}

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`.blue);
        client.user.setStatus("idle")
        client.user.setPresence({ activities: [{ name: 'The Dev Phase' }], status: 'idle' });

        await refresher(client); // Initial run.
        setTimeout(() => { // Wait until the next 4 or 9 minute mark to start.
            refresher(client); // Run immediately.
            setInterval(() => refresher(client), 5 * 60 * 1000); // Run every 5 minutes. 
        }, msUntilNext49MinuteMark());
    },
};


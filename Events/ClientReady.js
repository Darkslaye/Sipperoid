const { Events } = require('discord.js');
const colors = require('colors');
const refresher = require('./Refresher.js');

const { QuickDB } = require('quick.db');
const db = new QuickDB();

const config = require('../config.json');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`.blue);
        client.user.setStatus("idle")
        client.user.setPresence({ activities: [{ name: 'The Dev Phase' }], status: 'idle' });
		// client.user.setBanner('./src/banner.png');
		
		const currentTime = new Date();
		const currentUTCDate = new Date(Date.UTC(
			currentTime.getUTCFullYear(),
			currentTime.getUTCMonth(),
			currentTime.getUTCDate(),
			currentTime.getUTCHours(),
			currentTime.getUTCMinutes(),
		));

		const currentDayofWeek = currentUTCDate.getUTCDay();
		const currentDay = currentUTCDate.getUTCDate();
		const currentHour = currentUTCDate.getUTCHours();
		const currentMinute = currentUTCDate.getUTCMinutes();
		// 12D 12H
		// 12H 12M



		
		console.log(
			`${currentDayofWeek}\n${currentDay}\n${currentHour}\n${currentMinute}`
		)

		// await refresher(client);

		setInterval(async () => {
			await refresher(client);
		}, 10000);
    },
};


const { Client, Collection, Events, GatewayIntentBits, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.commands = new Collection();
const commands = [];

// ----- Command Handler -----
const foldersPath = path.join(__dirname, 'Commands');
for (const folder of fs.readdirSync(foldersPath)) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
            client.commands.set(command.data.name, command);
        } else {
            console.warn(`[WARNING] The command at ${file} is missing "data" or "execute".`);
        }
    }
}

// ----- Deploy Commands -----
const rest = new REST().setToken(process.env.TOKEN_DISCORD);

(async () => {
    try {
        console.log("Refreshing guild commands...");

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), 
            { body: commands }
        );

        console.log("Commands registered successfully.");
    } catch (error) {
        console.error("Error loading commands:", error);
    }
})();

// ----- Interaction Handling -----
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} found.`);
        return interaction.reply({ content: "Command not available.", ephemeral: true });
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: "Error executing command.", ephemeral: true });
        } else {
            await interaction.reply({ content: "Error executing command.", ephemeral: true });
        }
    }
});

// ----- Events Handling -----
const eventsPath = path.join(__dirname, 'Events');
for (const file of fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'))) {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.login(process.env.TOKEN_DISCORD);

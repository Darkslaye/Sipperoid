const { Client, Collection, Events, GatewayIntentBits, REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const clashAPI = require('clash-of-clans-api'); // Need to use... Clash of Clans API!

const colors = require('colors')

require('dotenv').config()


const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

const commands = [];

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'Commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(process.env.TOKEN_DISCORD);

(async () => {
    const isActivated = true; // If set to false, any deletion will not be triggered.
    const forGuild = false; // Set to false if UPDATE is FULLY PATCHED!
    let data; // Data to be used for the commands.

    if (!isActivated) { 
        return;
    } else {
        try {
            if (forGuild) {
                // Deleteing Guild Commands.
                console.log("Deleting Guild Commands...")
                await rest.put(
                    Routes.applicationGuildCommands(process.env.ClientId, process.env.GuildId),
                    { body: [] }
                );
                console.log('Successfully deleted guild commands. Reloading commands now.');
            } else {
                // Deleting Global Commands.
                console.log("Deleting Global Commands...")
                await new Promise((resolve) => setTimeout(resolve, 5000));

                await rest.put(
                    Routes.applicationCommands(process.env.ClientId), 
                    { body: [] }
                );
                console.log('Successfully deleted global commands.\nReloading commands now.');
            }

            if (forGuild) {
                // Reloading Guild Commands.
                data = await rest.put(
                    Routes.applicationGuildCommands(process.env.ClientId, process.env.GuildId),
                    { body: commands }
                );
                console.log(`Successfully reloaded ${data.length} guild commands.`.green);
            } else {
                // Reloading Global Commands
                data = await rest.put(
                    Routes.applicationCommands(process.env.ClientId), 
                    { body: commands }
                );
                console.log(`Successfully reloaded ${data.length} global commands.`.green);
                }
        } catch (error) {
            console.error(error);
        }
    }
})();

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        await interaction.reply({
            content: 'This command is not available.',
            ephemeral: true, // Use flags: 64 if necessary
        }).catch(console.error); // Handle errors properly
        return;
    }

    try {
        // Execute the command
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error executing command ${interaction.commandName}:`, error);

        // Handle already acknowledged interactions
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command.',
                flags: 64,
            }).catch(console.error);
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command.',
                flags: 64,
            }).catch(console.error);
        }
    }
});

// ----- Events Handling ------
const eventsPath = path.join(__dirname, 'Events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// ----- Data Storage Handler -----
if (!fs.existsSync('./Database')) {
    fs.mkdirSync('./Database');
    fs.mkdirSync('./Database/Server');
    fs.mkdirSync('./Database/User');
}

client.login(process.env.TOKEN_DISCORD);
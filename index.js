// Require the necessary discord.js classes
import { Client, Intents } from 'discord.js';
import * as helpers from './helpers/index.js';
import config from './config.js';

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});
client.on('debug', (info) => {
	console.log(info);
});
client.on('error', (error) => {
	console.log(error);
});

client.on('messageCreate', (message) => {
	if (message.channelId === config.channels.suggestions) helpers.suggestionHelper(message);
});

// Login to Discord with your client's token
client.login(config.token);
// Require the necessary discord.js classes
import { Client, Intents } from 'discord.js';
import * as helpers from './helpers/index.js';
import config from './config.js';

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready! Initializing...');
	init();
	console.log('Initialized!');
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
client.on('messageReactionAdd', (messageReaction, user) => {
	if (messageReaction.message.channelId === config.channels.bugs && !user.bot) helpers.bugHelper(messageReaction, user);
});

// Login to Discord with your client's token
client.login(config.token);

const init = () => {
	// Load messages from bug-channel to cache to ensure triggering of events
	client.channels.fetch(config.channels.bugs)
		.then(channel => {
			channel.messages.fetch()
				.then(messages => {
					messages.each(message => {
						message.react('🐛');
					});
				});
		});
};
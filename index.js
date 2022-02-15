// Require the necessary discord.js classes
import { Client, Intents } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import * as commands from './commands/index.js';
import * as helpers from './helpers/index.js';
import config from './config.js';

// Require the necessary express classes
import express from 'express';
import helmet from 'helmet';

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
// Create a new express instance
const expressServer = express();
const expressRouter = express.Router();

/*
 * DISCORD CLIENT INIT
 */
client.once('ready', () => {
	console.log('Ready!');
	console.log('Initializing...');
	initDiscord();
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
client.on('interactionCreate', interaction => {
	if (interaction.isCommand() && commands[interaction.commandName] !== null && typeof commands[interaction.commandName] === 'function') commands[interaction.commandName](interaction);
});

// Login to Discord with your client's token
client.login(config.token);

const initDiscord = () => {
	// Register commands
	const commandRegister = [
		new SlashCommandBuilder()
			.setName('sayrich')
			.setDescription('Lets Gina say something fancy')
			.addStringOption(option =>
				option.setName('title')
					.setDescription('Title of the message'))
			.addStringOption(option =>
				option.setName('message')
					.setDescription('The message'))
			.addStringOption(option =>
				option.setName('color')
					.setDescription('Fancy color')),
		new SlashCommandBuilder()
			.setName('say')
			.setDescription('Lets Gina say something')
			.addStringOption(option =>
				option.setName('message')
					.setDescription('The message')
					.setRequired(true)),
	].map(command => command.toJSON());

	const rest = new REST({ version: '9' }).setToken(config.token);

	rest.put(Routes.applicationCommands(config.clientID), { body: commandRegister })
		.then(() => console.log('Successfully registered application commands.'))
		.catch(console.error);

	// Load messages from bug-channel to cache to ensure triggering of events
	client.channels.fetch(config.channels.bugs)
		.then(channel => {
			channel.messages.fetch()
				.then(messages => {
					messages.each(message => {
						message.react('🐛');
					});
				})
				.catch(err => {
					console.error(err);
				});
		})
		.catch(err => {
			console.error(err);
		});
};

/*
 * EXPRESS SERVER INIT
 */
expressRouter.get('/user/:tag', async (req, res) => {
	client.guilds.resolve(config.guildID).members.fetch({ query: req.params.tag, limit: 1 }).then((members) => {
		const member = members.at(0);
		if (member?.user) {
			res.send(member.user.id);
		}
		else {
			res.status(400).send('User not found');
		}
	}).catch((err) => {
		console.error(err);
		res.status(500).end();
	});
});

expressServer.use(helmet());
expressServer.use(expressRouter);

expressServer.listen(config.express.port, () => {
	console.log(`discord-gina express server listening on port ${config.express.port}`);
});
import { Permissions, MessageEmbed } from 'discord.js';
import config from '../config.js';

export default async (messageReaction, user) => {
	const guild = messageReaction.message.guild;
	const everyoneRole = guild.roles.everyone;
	const bugCategory = await guild.channels.fetch(config.channels.bugs_category);
	const curLength = bugCategory.children.size;

	const bugRolesOverwrites = config.roles.bugs.map(r => {
		return { type: 'role', id: r, allow: [Permissions.FLAGS.VIEW_CHANNEL] };
	});

	bugCategory.createChannel('Bug ' + (curLength + 1), {
		permissionOverwrites: bugRolesOverwrites.concat([
			{ type: 'member', id: user.id, allow: [Permissions.FLAGS.VIEW_CHANNEL] },
			{ type: 'role', id: everyoneRole.id, deny: [Permissions.FLAGS.VIEW_CHANNEL] },
		]),
	}).then(c => {
		const embed = new MessageEmbed()
			.setColor('#7A2F8F')
			.setTitle('Thank you for reporting a bug!')
			.addFields(
				{ name: 'Reporter', value: '<@' + user.id + '>', inline: true },
				{ name: 'Channel number', value: '' + (curLength + 1), inline: true },
			)
			.setDescription('Describe the bug below. Be as accurate and elaborate as possible. Use pictures, describe your action and/or provide logs and crash-reports if necessary.')
			.setTimestamp();

		c.send({ embeds: [embed] });
	});

	messageReaction.users.remove(user.id);
};
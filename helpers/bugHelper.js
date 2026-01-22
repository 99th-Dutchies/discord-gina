import { PermissionFlagsBits, EmbedBuilder, ChannelType } from 'discord.js';
import { convert } from 'any-to-any';
import config from '../config.js';

export default async (messageReaction, user) => {
	const guild = messageReaction.message.guild;
	const everyoneRole = guild.roles.everyone;
	const bugCategory = await guild.channels.fetch(config.channels.bugs_category);
	const id = convert((new Date).getTime() - (new Date(config.dateOffset)).getTime(), 10, 36);

	const bugRolesOverwrites = config.roles.bugs.map(r => {
		return { id: r, allow: [PermissionFlagsBits.ViewChannel] };
	});

	bugCategory.children.create({
		name: 'Bug ' + id,
		type: ChannelType.GuildText,
		permissionOverwrites: bugRolesOverwrites.concat([
			{ id: user.id, allow: [PermissionFlagsBits.ViewChannel] },
			{ id: everyoneRole.id, deny: [PermissionFlagsBits.ViewChannel] },
		]),
	}).then(c => {
		const embed = new EmbedBuilder()
			.setColor('#7A2F8F')
			.setTitle('Thank you for reporting a bug!')
			.addFields(
				{ name: 'Reporter', value: '<@' + user.id + '>', inline: true },
				{ name: 'Channel number', value: id, inline: true },
			)
			.setDescription('Describe the bug below. Be as accurate and elaborate as possible. Use pictures, describe your action and/or provide logs and crash-reports if necessary.')
			.setTimestamp();

		c.send({ embeds: [embed] });
	});

	messageReaction.users.remove(user.id);
};
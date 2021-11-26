import { MessageEmbed } from 'discord.js';

export default (interaction) => {
	const embed = new MessageEmbed()
		.setColor(interaction.options.getString('color') ?? '#ECD853')
		.setTitle(interaction.options.getString('title') ?? '')
		.setDescription(interaction.options.getString('message') ?? '')
		.setTimestamp();

	interaction.channel.send({ embeds: [embed] });

	interaction.reply('ok');
	interaction.deleteReply();
};
import { EmbedBuilder } from 'discord.js';

export default (interaction) => {
	const embed = new EmbedBuilder()
		.setColor(interaction.options.getString('color') ?? '#ECD853')
		.setTitle(interaction.options.getString('title') || null)
		.setDescription(interaction.options.getString('message') || null)
		.setTimestamp();

	interaction.channel.send({ embeds: [embed] });

	interaction.reply('ok');
	interaction.deleteReply();
};
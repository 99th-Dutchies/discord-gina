export default (interaction) => {
	interaction.channel.send(interaction.options.getString('message'));

	interaction.reply('ok');
	interaction.deleteReply();
};
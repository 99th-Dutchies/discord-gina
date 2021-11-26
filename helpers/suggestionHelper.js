export default (message) => {
	message.react('✅');
	message.react('❌');

	message.startThread({
		'name' : 'Suggestion ' + message.content,
		'reason': 'Use this thread to discuss or elaborate this suggestion',
	});
};
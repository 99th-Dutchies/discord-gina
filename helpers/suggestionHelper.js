export default (message) => {
	message.react('✅');
	message.react('❌');

	message.startThread({
		'name' : ('Suggestion ' + message.content).substring(0, 100),
		'reason': 'Use this thread to discuss or elaborate this suggestion',
	});
};
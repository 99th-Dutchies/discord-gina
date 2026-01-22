export default {
	guildID: 'your-guild-id-here',
	clientID: 'your-client-id-here',
	token: 'your-token-goes-here',
	channels: {
		suggestions: 'suggestions-channel-id',
		bugs: 'bugs-channel-id',
		bugs_category: 'bugs-category-id',
	},
	roles: {
		bugs: ['role-id-for-access-to-bug-channels', 'another-role-id-for-access-to-bug-channels'],
		ranks: [
			{
				link: 'link-for-retrieving-roles', // EG: https://api.your-domain.com/discord/roles/
				cooldown: 300,
				divider: 'role-id-for-divider-of-rolegroup',
				ranks: ['role-id-for-rank'],
			},
		],
	},
	dateOffset: '2021-01-01 00:00:00',
};
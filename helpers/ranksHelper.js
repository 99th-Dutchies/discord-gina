import https from 'https';
import config from '../config.js';

export default async (message, rankChecks) => {
	if (message.author.bot) return;

	for (let i = 0; i < config.roles.ranks.length; i++) {
		// Check if cooldown has passed
		if (rankChecks[message.author.id] !== undefined && rankChecks[message.author.id][i] !== undefined &&
			(new Date().getTime() - rankChecks[message.author.id][i]) < config.roles.ranks[i].cooldown * 1000) {
			continue;
		}

		// Register time for cooldown
		if (rankChecks[message.author.id] === undefined) rankChecks[message.author.id] = [];
		rankChecks[message.author.id][i] = new Date().getTime();

		const req = https.request(config.roles.ranks[i].link + message.author.id, {}, (res) => {
			res.on('data', async (d) => {
				try {
					if (res.statusCode === 200) {
						const r = JSON.parse(d).roles;
						const ru = message.member.roles;
						if (r.some(async rID => (await ru.resolve(rID)) === undefined)) {
							// Remove and (re)assign the roles
							message.member.roles
								.remove(config.roles.ranks[i].ranks)
								.then((updatedMember) => {
									updatedMember.roles.add(r)
										.catch((error) => console.log(error));
								})
								.catch((error) => console.log(error));
						}
					}
				}
				catch (e) {
					console.error(e);
				}
			});
		});

		req.on('error', error => {
			console.error(error);
		});
		req.end();
	}
};
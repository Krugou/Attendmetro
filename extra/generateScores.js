import {Octokit} from '@octokit/rest';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();
const owner = 'Krugou'; // replace with repository owner
const repo = 'JakSurveillance'; // replace with repository name
// console.log(process.env.GITHUBTOKEN);
const octokit = new Octokit({auth: process.env.GITHUBTOKEN});
const getContributorsStats = async () => {
	while (true) {
		const response = await octokit.rest.repos.getContributorsStats({
			owner,
			repo,
		});

		if (response.status === 200 && Array.isArray(response.data)) {
			return response.data;
		}

		console.log('Waiting for stats to be ready...');
		await new Promise((resolve) => setTimeout(resolve, 5000)); // wait for 5 seconds before retrying
	}
};
const generateScores = async () => {
	const contributors = await getContributorsStats();
	console.log(contributors);
	const scores = {};

	// @ts-ignore
	for (const contributor of contributors.data) {
		console.log('Processing contributor:', contributor.author.login);

		const login = contributor.author.login;
		const commits = contributor.total;
		const additions = contributor.weeks.reduce(
			(total, week) => total + week.a,
			0
		);
		const deletions = contributor.weeks.reduce(
			(total, week) => total + week.d,
			0
		);
		const totalChanges = additions - deletions;

		console.log(
			`Scores for ${login}: commits - ${commits}, additions - ${additions}, deletions - ${deletions}, total changes - ${totalChanges}`
		);

		scores[login] = {
			commits: commits,
			additions: additions,
			deletions: deletions,
			totalChanges: totalChanges,
		};
	}

	try {
		fs.writeFileSync('scores.json', JSON.stringify(scores, null, 2));
		console.log('Successfully wrote to scores.json');
	} catch (error) {
		console.error('Error writing to scores.json:', error);
	}
};

generateScores().catch(console.error);

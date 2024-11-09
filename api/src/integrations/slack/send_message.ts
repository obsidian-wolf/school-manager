import config from '../../config';

export async function sendMessage(message: string): Promise<void> {
	const { SLACK_CHANNEL, SLACK_OAUTH_TOKEN } = config;

	if (!SLACK_CHANNEL || !SLACK_OAUTH_TOKEN) {
		console.warn('Missing Slack configuration');
		return;
	}

	const response = await fetch(`https://slack.com/api/chat.postMessage`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${SLACK_OAUTH_TOKEN}`,
		},
		body: JSON.stringify({
			channel: SLACK_CHANNEL,
			blocks: [{ type: 'section', text: { type: 'mrkdwn', text: message } }],
		}),
	});

	if (!response.ok) {
		console.error('Failed to send Slack message', await response.text());
	}

	return;
}

export const Env = {
  targetUrl: process.env.TARGET_URL || requiredError("TARGET_URL"),
  slackWebhookUrl:
    process.env.SLACK_WEBHOOK_URL || requiredError("SLACK_WEBHOOK_URL"),
} as const;

function requiredError(name: string): never {
  throw new Error(`${name} is not set in environment variable`);
}

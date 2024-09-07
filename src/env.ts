export const Env = {
	targetUrl: process.env.TARGET_URL || requiredError("TARGET_URL"),
} as const;

function requiredError(name: string): never {
	throw new Error(`${name} is not set in environment variable`);
}

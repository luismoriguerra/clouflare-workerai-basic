

import { Ai } from '@cloudflare/ai';

type Bindings = {
	AI: Ai;
}

import { Hono } from 'hono';
const model = '@cf/mistral/mistral-7b-instruct-v0.1';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/chat', async (ctx) => {

	const content = ctx.req.query('query') || 'what is the origin of the phrase hello, world?';

	const ai = new Ai(ctx.env.AI);
	const messages = [
		{
			role: 'system', content: ' you are a friendly assistant',
		},
		{
			role: 'user', content,
		}
	];

	const inputs = { messages };

	const res = await ai.run(model, inputs);

	return ctx.json(res);

});


app.get('/', ctx => {
	return ctx.json({ message: 'Hello World!' });
})

export default app

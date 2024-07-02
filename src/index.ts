

import { Ai } from '@cloudflare/ai';
import streamingTemplate from "./streaming.html";

type Bindings = {
	AI: Ai;
}

import { Hono } from 'hono';
const model = '@cf/mistral/mistral-7b-instruct-v0.1';

const app = new Hono<{ Bindings: Bindings }>();
app.get("/", (c) => c.html(streamingTemplate));

app.get('/stream', async c => {
	const ai = new Ai(c.env.AI);
	const query = c.req.query('query');
	const question = query || 'what is the origin of the phrase hello, world?';

	const messages = [
		{
			role: 'system', content: ' you are a friendly assistant',
		},
		{
			role: 'user', content: question,
		}
	]

	const aiResponse: any = await ai.run('@cf/meta/llama-2-7b-chat-int8', { messages, stream: true });

	return new Response(aiResponse, {
		headers: {
			'Content-Type': 'text/event-stream',
		}
	})

});

app.get('/api/chat', async (ctx) => {

	const content = ctx.req.query('query') || 'what is the origin of the phrase hello, world?';

	const ai = new Ai(ctx.env.AI);

	const inputs = {
		messages: [
			{
				role: 'system', content: ' you are a friendly assistant',
			},
			{
				role: 'user', content,
			}
		]
	};

	const res = await ai.run(model, inputs);

	return ctx.json(res);

});

export default app

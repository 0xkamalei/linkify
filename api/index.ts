import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { linkService } from '../server/services/linkService'
import { topicService } from '../server/services/topicService'
import { commentService } from '../server/services/commentService'
import { voteService } from '../server/services/voteService'

import { logger } from 'hono/logger'

export const app = new Hono().basePath('/api')

app.use('*', logger())

app.onError((err, c) => {
    console.error('Hono Error:', err)
    return c.json({ error: 'Internal Server Error', message: err.message }, 500)
})

// Links API
app.get('/links', async (c) => {
    console.log('[API] GET /links start');
    const topicId = c.req.query('topicId')
    const userId = c.req.query('userId')
    try {
        const links = await linkService.listLinks(topicId, 20, userId)
        console.log('[API] GET /links success, count:', links.length);
        return c.json(links)
    } catch (e) {
        console.error('[API] GET /links error:', e);
        throw e;
    }
})

app.get('/links/:id', async (c) => {
    const id = c.req.param('id')
    const link = await linkService.getLink(id)
    if (!link) return c.json({ error: 'Not found' }, 404)
    return c.json(link)
})

app.post('/links', async (c) => {
    const body = await c.req.json()
    const id = await linkService.saveLink(body)
    return c.json({ id })
})

// Topics API
app.get('/topics', async (c) => {
    const topics = await topicService.listTopics()
    return c.json(topics)
})

app.get('/topics/:shortCode', async (c) => {
    const shortCode = c.req.param('shortCode')
    const topic = await topicService.getTopicByShortCode(shortCode)
    if (!topic) return c.json({ error: 'Not found' }, 404)
    return c.json(topic)
})

// Comments API
app.get('/comments', async (c) => {
    const linkId = c.req.query('linkId')
    if (!linkId) return c.json({ error: 'linkId required' }, 400)
    const comments = await commentService.listComments(linkId)
    return c.json(comments)
})

app.post('/comments', async (c) => {
    const body = await c.req.json()
    const id = await commentService.saveComment(body)
    return c.json({ id })
})

// Votes API
app.post('/votes', async (c) => {
    const { userId, targetId, type, isLike } = await c.req.json()
    const success = await voteService.vote(userId, targetId, type, isLike)
    return c.json({ success })
})

export default {
    port: 3000,
    fetch: app.fetch,
}

// For Vercel, this might need to be at the bottom or exported differently depending on version
const handler = handle(app)
export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH }

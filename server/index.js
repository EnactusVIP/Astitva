require('dotenv').config({ path: '.env.local' })

const express = require('express')
const cors = require('cors')
const { appendRow } = require('./excel')
const { getAIResponse } = require('../lib/chat')

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' })
    }

    const { reply, provider, errors } = await getAIResponse(messages)

    if (reply) {
      return res.json({ reply, provider })
    }

    res.json({
      reply:
        "I'm here for you, but all my connections are a little overwhelmed right now. " +
        "Please try again in a minute — I'm not going anywhere 💜",
      provider: 'fallback',
      errors,
    })
  } catch (err) {
    console.error('[chat]', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/join-community', async (req, res) => {
  try {
    const { name, phone, city } = req.body
    if (!name || !phone || !city) {
      return res.status(400).json({ error: 'name, phone, and city are required' })
    }
    await appendRow('joinCommunity', [name, phone, city])
    res.json({ ok: true })
  } catch (err) {
    console.error('[join-community]', err)
    res.status(500).json({ error: 'Failed to save response' })
  }
})

app.post('/api/counselling-booking', async (req, res) => {
  try {
    const { name, email, phone, agenda } = req.body
    if (!name || !email || !phone || !agenda) {
      return res.status(400).json({ error: 'name, email, phone, and agenda are required' })
    }
    await appendRow('counselling', [name, email, phone, agenda])
    res.json({ ok: true })
  } catch (err) {
    console.error('[counselling-booking]', err)
    res.status(500).json({ error: 'Failed to save response' })
  }
})

app.post('/api/anonymous', async (req, res) => {
  try {
    const { topic, message } = req.body
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'message is required' })
    }
    await appendRow('anonymous', [topic || 'Others', message])
    res.json({ ok: true })
  } catch (err) {
    console.error('[anonymous]', err)
    res.status(500).json({ error: 'Failed to save response' })
  }
})

const PORT = process.env.SERVER_PORT || 3001
app.listen(PORT, () => {
  console.log(`[Astitva] Excel response server running on http://localhost:${PORT}`)
})

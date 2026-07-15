const { getAIResponse } = require('../lib/chat')

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { messages } = req.body || {}
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required' })
      return
    }

    const { reply, provider, errors } = await getAIResponse(messages)

    if (reply) {
      res.status(200).json({ reply, provider })
      return
    }

    res.status(200).json({
      reply:
        "I'm here for you, but all my connections are a little overwhelmed right now. " +
        "Please try again in a minute — I'm not going anywhere 💜",
      provider: 'fallback',
      errors,
    })
  } catch (err) {
    console.error('[api/chat]', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

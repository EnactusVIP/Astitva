const { appendRow } = require('../lib/excel-blob')

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { topic, message } = req.body || {}
    if (!message || !message.trim()) {
      res.status(400).json({ error: 'message is required' })
      return
    }
    await appendRow('anonymous', [topic || 'Others', message])
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[api/anonymous]', err)
    res.status(500).json({ error: 'Failed to save response' })
  }
}

const { appendRow } = require('../lib/excel-blob')

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { name, phone, city } = req.body || {}
    if (!name || !phone || !city) {
      res.status(400).json({ error: 'name, phone, and city are required' })
      return
    }
    await appendRow('joinCommunity', [name, phone, city])
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[api/join-community]', err)
    res.status(500).json({ error: 'Failed to save response' })
  }
}

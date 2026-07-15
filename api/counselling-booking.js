const { appendRow } = require('../lib/excel-blob')

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { name, email, phone, agenda } = req.body || {}
    if (!name || !email || !phone || !agenda) {
      res.status(400).json({ error: 'name, email, phone, and agenda are required' })
      return
    }
    await appendRow('counselling', [name, email, phone, agenda])
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[api/counselling-booking]', err)
    res.status(500).json({ error: 'Failed to save response' })
  }
}

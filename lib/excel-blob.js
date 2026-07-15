// Production storage — persists responses.xlsx in Vercel Blob storage since
// serverless functions have no writable local disk. Requires BLOB_READ_WRITE_TOKEN
// (auto-set by Vercel once a Blob store is connected to the project). Stored
// with access: 'private' — the file requires an authenticated request via the
// SDK, not a public URL, since it holds names/emails/phone numbers/agendas.
//
// Caveat: the read-modify-write cycle below is only serialized within a single
// warm function instance (via writeQueue). Two cold-started instances handling
// simultaneous submissions can still race and one write can clobber the other.
// A real database would not have this gap — acceptable here only because
// traffic is low.

const { put, get } = require('@vercel/blob')
const ExcelJS = require('exceljs')

const BLOB_PATHNAME = 'responses.xlsx'
const BLOB_ACCESS = 'private'

const SHEETS = {
  joinCommunity: {
    name: 'Join Community',
    headers: ['Timestamp', 'Name', 'Phone', 'City'],
  },
  counselling: {
    name: 'Counselling Bookings',
    headers: ['Timestamp', 'Name', 'Email', 'Phone', 'Agenda'],
  },
  anonymous: {
    name: 'Anonymous Submissions',
    headers: ['Timestamp', 'Topic', 'Message'],
  },
}

let writeQueue = Promise.resolve()

async function loadWorkbook() {
  const workbook = new ExcelJS.Workbook()

  const existing = await get(BLOB_PATHNAME, { access: BLOB_ACCESS })
  if (existing) {
    const chunks = []
    for await (const chunk of existing.stream) chunks.push(chunk)
    await workbook.xlsx.load(Buffer.concat(chunks))
  }

  for (const sheet of Object.values(SHEETS)) {
    if (!workbook.getWorksheet(sheet.name)) {
      const ws = workbook.addWorksheet(sheet.name)
      ws.addRow(sheet.headers)
      ws.getRow(1).font = { bold: true }
      ws.columns = sheet.headers.map(() => ({ width: 26 }))
    }
  }

  return workbook
}

function appendRow(sheetKey, rowValues) {
  const sheet = SHEETS[sheetKey]
  if (!sheet) throw new Error(`Unknown sheet key: ${sheetKey}`)

  writeQueue = writeQueue.then(async () => {
    const workbook = await loadWorkbook()
    const ws = workbook.getWorksheet(sheet.name)
    ws.addRow([new Date().toISOString(), ...rowValues])
    const buffer = await workbook.xlsx.writeBuffer()
    await put(BLOB_PATHNAME, buffer, {
      access: BLOB_ACCESS,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
  })

  return writeQueue
}

module.exports = { appendRow, SHEETS }

const path = require('path')
const fs = require('fs')
const ExcelJS = require('exceljs')

const DATA_DIR = path.join(__dirname, '..', 'data')
const FILE_PATH = path.join(DATA_DIR, 'responses.xlsx')

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

// Serializes reads/writes so concurrent requests can't clobber each other —
// exceljs has no built-in file locking, so each append re-reads, mutates,
// and re-writes the whole workbook in a single queued chain.
let writeQueue = Promise.resolve()

async function loadWorkbook() {
  const workbook = new ExcelJS.Workbook()
  if (fs.existsSync(FILE_PATH)) {
    await workbook.xlsx.readFile(FILE_PATH)
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
    fs.mkdirSync(DATA_DIR, { recursive: true })
    const workbook = await loadWorkbook()
    const ws = workbook.getWorksheet(sheet.name)
    ws.addRow([new Date().toISOString(), ...rowValues])
    await workbook.xlsx.writeFile(FILE_PATH)
  })

  return writeQueue
}

module.exports = { appendRow, SHEETS, FILE_PATH }

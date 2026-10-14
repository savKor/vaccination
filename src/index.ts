import fs from 'fs'

import { create } from './utils/create'
import { listPdf, moveFile, PdfFile } from './utils/files'
import { find } from './utils/find'
import { generateId } from './utils/generateId'
import { login } from './utils/login'
import { upload } from './utils/upload'

const { ORIGIN_FOLDER, ARCHIVE_FOLDER, ERROR_FOLDER } = process.env as Record<string, string>

const findVaccination = async (vaccinationId: number) => {
  const [vaccination] = await find({
    model: 'Sharan.Vaccination',
    fields: 'vaccinationId vaccineName vaccinationDate doseNumber',
    conditions: { vaccinationId },
    childRel: [{ model: 'Sharan.Client', opposite: 'client', fields: '_id fullNameClient' }],
  })
  return vaccination
}

const passToSharan = async (file: PdfFile) => {
  const vaccination = file.vaccinationId ? await findVaccination(file.vaccinationId) : undefined
  if (!vaccination?.client) {
    console.log(`${file.name}: vaccination ${file.vaccinationId} not found or has no client -> error`)
    moveFile(file, ERROR_FOLDER)
    return
  }

  // 1. attachment record linked to the client, 2. the file itself
  const fileId = generateId()
  const attachmentId = await create(
    'Sharan.Attachment',
    {
      type: 'Other',
      iForm: false,
      fileName: `[${fileId}]_${file.name}`,
      description: `Vaccination ${vaccination.vaccineName}, dose ${vaccination.doseNumber ?? '-'} (#${vaccination.vaccinationId})`,
      date: new Date().toISOString(),
    },
    [{ key: 'client', serverModel: 'Sharan.Client', relName: 'Sharan.ClientAttachment', to: vaccination.client._id }],
  )
  await upload(fileId, file.name, attachmentId, fs.readFileSync(file.fullPath))

  moveFile(file, ARCHIVE_FOLDER)
  console.log(`${file.name}: attached to ${vaccination.client.fullNameClient} (attachment ${attachmentId}) -> archive`)
}

const main = async () => {
  for (const folder of [ORIGIN_FOLDER, ARCHIVE_FOLDER, ERROR_FOLDER]) {
    if (!folder || !fs.existsSync(folder)) throw new Error(`folder not found: ${folder}`)
  }

  await login(process.env.LOGIN!, process.env.PASSWORD!)

  const files = listPdf(ORIGIN_FOLDER)
  console.log(`files: ${files.length}`)

  // one file at a time: a failure doesn't stop the others, the file stays in origin
  for (const file of files) {
    await passToSharan(file).catch(err => console.error(`${file.name}: ${err.message}`))
  }
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})

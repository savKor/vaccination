import fs from 'fs'
import path from 'path'

export interface PdfFile {
  name: string
  fullPath: string
  vaccinationId: number // leading number of the file name, 0 if none
}

// all PDFs in the folder; "5_covid.pdf" -> vaccinationId 5
export const listPdf = (folder: string): PdfFile[] =>
  fs
    .readdirSync(folder)
    .filter(name => path.extname(name).toLowerCase() === '.pdf')
    .map(name => ({
      name,
      fullPath: path.join(folder, name),
      vaccinationId: Number(name.match(/^\d+/)?.[0] ?? 0),
    }))

// move into archive / error with a timestamp so names never clash
export const moveFile = (file: PdfFile, folder: string) => {
  const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 17)
  fs.renameSync(file.fullPath, path.join(folder, `${stamp}_${file.name}`))
}

import { request } from './request'

// upload file content into Sharan and bind it to a Sharan.Attachment record
// (same upload_file path blood_test uses, parsed by grainjs global_blob.uploadBLOB)
export const upload = async (fileId: string, fileName: string, attachmentId: string, content: Buffer) => {
  const field = 'vaccination'
  const path = `/upload_file/${field}---[${fileId}]_${fileName}--md--${attachmentId}--md--Sharan.Attachment`

  const form = new FormData()
  form.append(field, new Blob([new Uint8Array(content)], { type: 'application/pdf' }), fileName)

  const res = await request(encodeURI(path), { method: 'POST', body: form })
  const result = await res.json().catch(() => null)
  if (!result?.success || result.err) throw new Error(`upload ${fileName} failed: ${JSON.stringify(result)}`)
}

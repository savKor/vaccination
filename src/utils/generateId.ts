import { randomBytes } from 'crypto'

// 24-hex id, MongoDB ObjectId compatible
export const generateId = () => randomBytes(12).toString('hex')

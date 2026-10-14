import { direct } from './direct'
import { generateId } from './generateId'

// create one record; belongsTo links it to an existing one,
// e.g. { key: 'client', serverModel: 'Sharan.Client', to: clientId }
export const create = async (model: string, fields: Record<string, unknown>, belongsTo: object[] = []) => {
  const id = generateId()
  const change = {
    serverModel: model,
    action: 'create',
    objectId: id,
    changes: [{ key: '_id', to: id }, ...Object.entries(fields).map(([key, to]) => ({ key, to }))],
    hasMany: [],
    belongsTo: belongsTo.map(link => ({ from: '', ...link })),
  }
  const result = await direct('DirectFormSubmit', [[change]])
  if (result?.success !== true) throw new Error(`create ${model} failed: ${JSON.stringify(result)}`)
  return id
}

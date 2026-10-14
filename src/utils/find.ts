import { direct } from './direct'

// read records: { model, fields, conditions, childRel }
export const find = async (query: object): Promise<any[]> => {
  const result = await direct('runQuery', [{ queryIn: query }])
  if (!Array.isArray(result)) throw new Error(`runQuery failed: ${JSON.stringify(result)}`)
  return result
}

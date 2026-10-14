import { request } from './request'

// call of a Sharan Ext.Direct method: Modeleditor.runQuery, Modeleditor.DirectFormSubmit, ...
export const direct = async (method: string, data: unknown[]) => {
  const res = await request('/direct/entry', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action: 'Modeleditor', method, data, type: 'rpc', tid: 1 }),
  })
  const [answer] = await res.json()
  if (answer.type === 'exception') throw new Error(answer.message)
  return answer.result
}

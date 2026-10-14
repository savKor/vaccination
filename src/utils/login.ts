import { find } from './find'
import { request } from './request'

// 1. login -> session cookie, 2. choose profile (without it creating records fails)
export const login = async (login: string, password: string) => {
  await request('/login/checkUser', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ login, password }),
  })
  await request('/login/checkUser/selectProfile?profile=default&tenant=default')

  // Sharan answers 200 even for a wrong password, so check with a real query
  const me = await find({ model: 'Application.User', conditions: { login } }).catch(() => [])
  if (!me.length) throw new Error(`login failed for ${login}`)
}

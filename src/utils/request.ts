// HTTP to Sharan with the session cookie kept between calls
export const APP_URL = process.env.APP_URL || 'http://localhost:3102'

let cookie = ''

const saveCookies = (res: Response) => {
  const jar = new Map(cookie.split('; ').filter(Boolean).map(c => c.split('=') as [string, string]))
  for (const raw of res.headers.getSetCookie()) {
    const [name, value] = raw.split(';')[0].split('=')
    jar.set(name, value)
  }
  cookie = [...jar].map(([k, v]) => `${k}=${v}`).join('; ')
}

export const request = async (path: string, init: RequestInit = {}) => {
  const res = await fetch(APP_URL + path, {
    ...init,
    headers: { ...init.headers, cookie },
    redirect: 'manual', // keep cookies of every login step
  })
  saveCookies(res)
  return res
}

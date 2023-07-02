import { z } from 'zod'
import { envSchema } from './env'
import { FetchUrlsFn } from './types'

const FETCH_URL = 'https://www.virustotal.com/vtapi/v2/domain/report'

const responseSchema = z.object({
  detected_urls: z.array(
    z.object({
      url: z.string(),
    })
  ),
})

export const getVirusTotalURLs: FetchUrlsFn = async ({ domain, noSubs }) => {
  const apiKey = envSchema.VT_API_KEY

  if (!apiKey) {
    return []
  }

  const fetchURL = new URL(FETCH_URL)
  fetchURL.searchParams.set('apiKey', apiKey)
  fetchURL.searchParams.set('domain', domain)

  const response = await fetch(fetchURL).then((r) => r.json())
  const data = responseSchema.parse(response)
  const result = data.detected_urls.map(({ url }) => {
    return {
      url,
      date: '',
    }
  })

  return result
}

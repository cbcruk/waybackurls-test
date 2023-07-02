import { z } from 'zod'
import { FetchUrlsFn } from './types'

const FETCH_URL = 'http://index.commoncrawl.org/CC-MAIN-2018-22-index'

const responseSchema = z.string()

const crawlDataSchema = z.object({
  timestamp: z.string(),
  url: z.string(),
})

export const getCommonCrawlURLs: FetchUrlsFn = async ({ domain, noSubs }) => {
  const subsWildcard = noSubs ? '' : '*.'
  const url = new URL(FETCH_URL)
  url.searchParams.set('url', `${subsWildcard}${domain}`)
  url.searchParams.set('output', 'json')
  const response = await fetch(url).then((r) => r.json())
  const data = responseSchema.parse(response)
  const lines = data.split('\n').map((line) => {
    const { timestamp: date, url } = crawlDataSchema.parse(JSON.parse(line))

    return {
      date,
      url,
    }
  })

  return lines
}

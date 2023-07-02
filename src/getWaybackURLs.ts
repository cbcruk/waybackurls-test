import { z } from 'zod'

export const FETCH_URL = 'https://web.archive.org/cdx/search'

export const responseSchema = z.array(z.array(z.string()))

export const getWaybackURLs = async ({ domain, noSubs }) => {
  const cdxUrl = new URL(`${FETCH_URL}/cdx`)
  const subsWildcard = noSubs ? '' : '*.'
  cdxUrl.searchParams.set('url', `${subsWildcard}${domain}/*`)
  cdxUrl.searchParams.set('output', 'json')
  cdxUrl.searchParams.set('collapse', 'urlkey')

  const response = await fetch(cdxUrl.toString())
  const data = responseSchema.parse(response)
  const result = data.slice(1).map((item) => {
    return {
      date: item[1],
      url: item[2],
    }
  })

  return result
}

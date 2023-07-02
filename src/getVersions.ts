import fetch from 'node-fetch'
import { z } from 'zod'
import { FETCH_URL, responseSchema } from './getWaybackURLs'

const domainSchema = z.string()
const urlSchema = z.string()
const domainsSchema = z.array(domainSchema)
const urlsSchema = z.array(urlSchema)

export async function getVersions(domains: z.infer<typeof domainsSchema>) {
  const urlsMap = new Map<
    z.infer<typeof domainSchema>,
    z.infer<typeof urlsSchema>
  >()
  const cdxUrl = new URL(FETCH_URL)

  for (const domain of domains) {
    cdxUrl.searchParams.set('url', domain)
    cdxUrl.searchParams.set('output', 'json')
    cdxUrl.searchParams.set('limit', '10')

    const response = await fetch(cdxUrl.toString()).then((r) => r.json())
    const data = responseSchema.parse(response)
    const [_, ...list] = data
    const urls = list.map((item) => {
      return `${FETCH_URL}/web/${item[1]}if_/${item[2]}`
    })

    urlsMap.set(domain, urls)
  }

  return urlsMap
}

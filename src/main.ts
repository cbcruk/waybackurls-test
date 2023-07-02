import { P, match } from 'ts-pattern'
import { getVersions } from './getVersions'
import { getWaybackURLs } from './getWaybackURLs'
import { isSubdomain } from './isSubdomain'
import { FetchUrlsFn } from './types'
import { parseArgv } from './parseArgv'

export async function main(argv?: Parameters<typeof parseArgv>[0]) {
  match(parseArgv(argv || process.argv.slice(2)))
    .with({ domains: P.when((domains) => domains.length === 0) }, () => {
      console.log('Please provide domain names as arguments.')
    })
    .with({ 'get-versions': true }, async ({ domains }) => {
      const versions = await getVersions(domains)
      console.log(versions)
    })
    .otherwise(async ({ domains, 'no-subs': noSubs, dates }) => {
      const memo = new Map<string, boolean>()
      const urls = new Set<Awaited<ReturnType<FetchUrlsFn>>>()

      for (const domain of domains) {
        const fetchFns = [getWaybackURLs]

        for (const fetchFn of fetchFns) {
          try {
            const result = await fetchFn({ domain, noSubs })
            const list = result.filter((item) => {
              return match({
                noSubs,
                isSubdomain: isSubdomain({ rawUrl: item.url, domain }),
              })
                .with({ noSubs: true, isSubdomain: true }, () => false)
                .otherwise(() => true)
            })

            urls.add(list)
          } catch (e) {
            console.error(e)
          }
        }
      }

      Array.from(urls)
        .flat()
        .forEach(({ url, date }) => {
          memo.set(url, true)

          match(dates)
            .with(true, () => {
              const d = new Date(date)

              match(isNaN(d.getTime()))
                .with(false, () => {
                  console.log(`${d.toISOString()} ${url}`)
                })
                .otherwise(() => {
                  console.error(
                    `Failed to parse date [${date}] for URL [${url}]`
                  )
                })
            })
            .otherwise(() => {
              console.log(url)
            })
        })
    })
}

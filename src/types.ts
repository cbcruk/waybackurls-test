import { z } from 'zod'

const fetchUrlsParams = z.object({
  domain: z.string(),
  noSubs: z.boolean(),
})

const fetchUrlsResponse = z.array(
  z.object({
    date: z.string(),
    url: z.string(),
  })
)

export type FetchUrlsFn = ({
  domain,
  noSubs,
}: z.infer<typeof fetchUrlsParams>) => Promise<
  z.infer<typeof fetchUrlsResponse>
>

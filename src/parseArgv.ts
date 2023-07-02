import { parse } from 'tinyargs'
import { z } from 'zod'

const CLI_ARGS = {
  dates: 'dates',
  no_subs: 'no-subs',
  get_versions: 'get-versions',
  domains: 'domains',
} as const

const cliSchema = z.object({
  [CLI_ARGS.dates]: z.boolean(),
  [CLI_ARGS.no_subs]: z.boolean(),
  [CLI_ARGS.get_versions]: z.boolean(),
  [CLI_ARGS.domains]: z.array(z.string()),
})

export function parseArgv(argv: NodeJS.Process['argv']) {
  const cli = parse(argv, [
    { name: CLI_ARGS.dates, type: Boolean },
    { name: CLI_ARGS.no_subs, type: Boolean },
    { name: CLI_ARGS.get_versions, type: Boolean },
    { name: CLI_ARGS.domains, type: String, positional: true, multiple: true },
  ])

  return cliSchema.parse(cli)
}

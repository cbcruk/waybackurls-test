import { describe, expect, it } from 'vitest'
import { main } from '../src/main'

describe('waybackurls', () => {
  it('main', async () => {
    expect(
      await main([
        '--dates',
        '--no-subs',
        '--get-versions',
        'https://google.com',
      ])
    ).toMatchInlineSnapshot('undefined')
  })
})

type Params = {
  rawUrl: string
  domain: string
}

export function isSubdomain({ rawUrl, domain }: Params) {
  try {
    const hostname = new URL(rawUrl).hostname

    return hostname.toLowerCase() !== domain.toLowerCase()
  } catch (error) {
    return false
  }
}

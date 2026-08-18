import 'server-only'

import { cookies, headers } from 'next/headers'
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'
import type { Locale } from '.'
import { i18n } from '.'

export const getLocaleOnServer = async (): Promise<Locale> => {
  // @ts-expect-error locales are readonly
  const locales: string[] = i18n.locales

  let languages: string[] | undefined
  // get locale from cookie
  const localeCookie = (await cookies()).get('locale')
  languages = localeCookie?.value ? [localeCookie.value] : []

  if (!languages.length) {
    // Negotiator expects plain object so we need to transform headers
    const negotiatorHeaders: Record<string, string> = {}
    const headersList = await headers()
    headersList.forEach((value, key) => (negotiatorHeaders[key] = value))
    // Use negotiator and intl-localematcher to get best locale
    languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  }

  // Negotiator returns ['*'] when Accept-Language is absent or a wildcard —
  // which is what Next.js internal RSC/prefetch requests send (they show up
  // with a `undici` user agent). Intl.getCanonicalLocales() throws a RangeError
  // on those tags, which crashed page renders with a 500, so drop anything
  // that isn't a valid language tag before matching.
  const validLanguages = (languages || []).filter((lang) => {
    if (!lang || lang === '*') { return false }
    try {
      Intl.getCanonicalLocales(lang)
      return true
    }
    catch {
      return false
    }
  })

  if (!validLanguages.length) { return i18n.defaultLocale as Locale }

  try {
    return match(validLanguages, locales, i18n.defaultLocale) as Locale
  }
  catch {
    return i18n.defaultLocale as Locale
  }
}

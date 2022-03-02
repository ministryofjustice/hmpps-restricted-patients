// @ts-expect-error: No types available for ga-gtag module yet
import { gtag, install } from 'ga-gtag'
import config from './config'

export const raiseAnalyticsEvent = (
  category: string,
  action: string,
  label: string,
  value?: number
): void | Promise<void> => {
  if (!config.analytics.googleAnalyticsId) return Promise.resolve()
  install(config.analytics.googleAnalyticsId)
  const data = {
    event_category: category,
    event_label: label,
    value,
  }

  return gtag('event', action, data)
}

export default {
  raiseAnalyticsEvent,
}

import { createClient } from 'redis'

import logger from '../../logger'
import config from '../config'

export type RedisClient = ReturnType<typeof createClient>

const url =
  config.redis.tls_enabled === 'true'
    ? `rediss://${config.redis.host}:${config.redis.port}`
    : `redis://${config.redis.host}:${config.redis.port}`

export const createRedisClient = (legacyMode = false): RedisClient => {
  const client = createClient({
    url,
    password: config.redis.password,
    legacyMode,
  })

  client.on('error', (e: Error) => logger.error('Redis client error', e))

  return client
}

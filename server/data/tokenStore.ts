import { promisify } from 'util'
import { createRedisClient, RedisClient } from './redisClient'

export default class TokenStore {
  private redisClient: RedisClient

  private readonly prefix = 'systemToken:'

  constructor(redisClient: RedisClient = createRedisClient()) {
    this.redisClient = redisClient
  }

  public async setToken(key: string, token: string, durationSeconds: number): Promise<void> {
    await this.ensureConnected()
    await this.redisClient.set(`${this.prefix}${key}`, token, { EX: durationSeconds })
  }

  public async getToken(key: string): Promise<string> {
    await this.ensureConnected()
    return this.redisClient.get(`${this.prefix}${key}`)
  }

  private async ensureConnected() {
    if (!this.redisClient.isOpen) {
      await this.redisClient.connect()
    }
  }
}

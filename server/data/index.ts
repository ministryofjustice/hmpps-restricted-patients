/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { AuthenticationClient, InMemoryTokenStore, RedisTokenStore } from '@ministryofjustice/hmpps-auth-clients'
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'
import applicationInfoSupplier from '../applicationInfo'

const applicationInfo = applicationInfoSupplier()
initialiseAppInsights()
buildAppInsightsClient(applicationInfo)

import HmppsAuthClient from './hmppsAuthClient'
import ManageUsersApiClient from './manageUsersApiClient'
import { createRedisClient } from './redisClient'
import config from '../config'
import PrisonApiClient from './prisonApiClient'
import logger from '../../logger'
import PrisonerSearchClient from './prisonerSearchClient'

export const dataAccess = () => {
  const authenticationClient = new AuthenticationClient(
    config.apis.hmppsAuth,
    logger,
    config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore(),
  )

  return {
    applicationInfo,
    hmppsAuthClient: new HmppsAuthClient(
      config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore(),
    ),
    manageUsersApiClient: new ManageUsersApiClient(),
    prisonApiClient: new PrisonApiClient(authenticationClient),
    prisonerSearchClient: new PrisonerSearchClient(authenticationClient),
  }
}

export { HmppsAuthClient, ManageUsersApiClient, PrisonApiClient }

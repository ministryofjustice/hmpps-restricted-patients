const production = process.env.NODE_ENV === 'production'

function get<T>(name: string, fallback: T, options = { requireInProduction: false }): T | string {
  if (process.env[name]) {
    return process.env[name]
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

const requiredInProduction = { requireInProduction: true }

export class AgentConfig {
  // Sets the working socket to timeout after timeout milliseconds of inactivity on the working socket.
  timeout: number

  constructor(timeout = 8000) {
    this.timeout = timeout
  }
}

export interface ApiConfig {
  url: string
  timeout: {
    // sets maximum time to wait for the first byte to arrive from the server, but it does not limit how long the
    // entire download can take.
    response: number
    // sets a deadline for the entire request (including all uploads, redirects, server processing time) to complete.
    // If the response isn't fully downloaded within that time, the request will be aborted.
    deadline: number
  }
  agent: AgentConfig
}

export default {
  buildNumber: get('BUILD_NUMBER', '1_0_0', requiredInProduction),
  productId: get('PRODUCT_ID', 'UNASSIGNED', requiredInProduction),
  gitRef: get('GIT_REF', 'xxxxxxxxxxxxxxxxxxx', requiredInProduction),
  branchName: get('GIT_BRANCH', 'xxxxxxxxxxxxxxxxxxx', requiredInProduction),
  https: production,
  staticResourceCacheDuration: 20,
  redis: {
    host: get('REDIS_HOST', 'localhost', requiredInProduction),
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_AUTH_TOKEN,
    tls_enabled: get('REDIS_TLS_ENABLED', 'false'),
  },
  session: {
    secret: get('SESSION_SECRET', 'app-insecure-default-session', requiredInProduction),
    expiryMinutes: Number(get('WEB_SESSION_TIMEOUT_IN_MINUTES', 120)),
  },
  apis: {
    hmppsAuth: {
      url: get('HMPPS_AUTH_URL', 'http://localhost:9090/auth', requiredInProduction),
      externalUrl: get('HMPPS_AUTH_EXTERNAL_URL', get('HMPPS_AUTH_URL', 'http://localhost:9090/auth')),
      timeout: {
        response: Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('HMPPS_AUTH_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('HMPPS_AUTH_TIMEOUT_RESPONSE', 10000))),
      apiClientId: get('API_CLIENT_ID', 'clientid', requiredInProduction),
      apiClientSecret: get('API_CLIENT_SECRET', 'clientsecret', requiredInProduction),
      systemClientId: get('SYSTEM_CLIENT_ID', 'clientid', requiredInProduction),
      systemClientSecret: get('SYSTEM_CLIENT_SECRET', 'clientsecret', requiredInProduction),
    },
    prison: {
      url: get('PRISON_API_URL', 'http://localhost:8080', requiredInProduction),
      timeout: {
        response: Number(get('PRISON_API_TIMEOUT_RESPONSE', 10000)),
        deadline: Number(get('PRISON_API_TIMEOUT_DEADLINE', 10000)),
      },
      agent: new AgentConfig(Number(get('PRISON_API_TIMEOUT_RESPONSE', 10000))),
    },
    prisonerSearch: {
      url: get('PRISONER_SEARCH_API_URL', 'http://localhost:8083', requiredInProduction),
      timeout: {
        response: Number(get('PRISONER_SEARCH_TIMEOUT_RESPONSE', 15000)),
        deadline: Number(get('PRISONER_SEARCH_TIMEOUT_DEADLINE', 15000)),
      },
      agent: new AgentConfig(Number(get('PRISONER_SEARCH_TIMEOUT_RESPONSE', 15000))),
    },
    restrictedPatientApi: {
      url: get('RESTRICTED_PATIENT_API_URL', 'http://localhost:8084', requiredInProduction),
      timeout: {
        // bumped to 30 seconds as prisoner re-index was taking > 15 seconds
        response: Number(get('RESTRICTED_PATIENT_API_TIMEOUT_RESPONSE', 30000)),
        deadline: Number(get('RESTRICTED_PATIENT_API_TIMEOUT_DEADLINE', 30000)),
      },
      agent: new AgentConfig(Number(get('RESTRICTED_PATIENT_API_TIMEOUT_RESPONSE', 30000))),
    },
    tokenVerification: {
      url: get('TOKEN_VERIFICATION_API_URL', 'http://localhost:8100', requiredInProduction),
      timeout: {
        response: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('TOKEN_VERIFICATION_API_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('TOKEN_VERIFICATION_API_TIMEOUT_DEADLINE', 5000))),
      enabled: get('TOKEN_VERIFICATION_ENABLED', 'false') === 'true',
    },
    frontendComponents: {
      url: get('FRONTEND_COMPONENTS_URL', 'http://localhost:8085/frontend-components', requiredInProduction),
      timeout: {
        response: Number(get('FRONTEND_COMPONENTS_TIMEOUT_RESPONSE', 5000)),
        deadline: Number(get('FRONTEND_COMPONENTS_TIMEOUT_DEADLINE', 5000)),
      },
      agent: new AgentConfig(Number(get('FRONTEND_COMPONENTS_TIMEOUT_RESPONSE', 5000))),
      enabled: get('FRONTEND_COMPONENTS_ENABLED', 'false') === 'true',
    },
  },
  analytics: {
    tagManagerContainerId: get('TAG_MANAGER_CONTAINER_ID', ''),
  },
  domain: get('INGRESS_URL', 'http://localhost:3000', requiredInProduction),
  pshUrl: get('PSH_URL', 'http://localhost:3002', requiredInProduction),
  environmentName: get('ENVIRONMENT_NAME', ''),
}

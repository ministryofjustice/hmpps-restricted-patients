const { stubFor } = require('./wiremock')

module.exports = {
  stubPing: (status = 200) => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: '/verification/health/ping',
      },
      response: {
        status,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { status: 'UP' },
      },
    })
  },
  stubVerifyToken: (status = 200) => {
    return stubFor({
      request: {
        method: 'POST',
        urlPattern: '/verification/token/verify',
      },
      response: {
        status,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { active: 'true' },
      },
    })
  },
}

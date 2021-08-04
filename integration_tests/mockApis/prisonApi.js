const { stubFor } = require('./wiremock')

const stubPing = (status = 200) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/prisonApi/health/ping',
    },
    response: {
      status,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { status: 'UP' },
    },
  })

const stubGetAgenciesByType = ({ type, response = [], active = true }) =>
  stubFor({
    request: {
      method: 'GET',
      url: `/prisonApi/api/agencies/type/${type}?active=${active}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: response,
    },
  })

const stubGetPrisonerDetails = ({ prisonerNumber, response = {} }) =>
  stubFor({
    request: {
      method: 'GET',
      url: `/prisonApi/api/offenders/${prisonerNumber}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: response,
    },
  })

module.exports = {
  stubPing,
  stubGetAgenciesByType,
  stubGetPrisonerDetails,
}

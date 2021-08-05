const { stubFor } = require('./wiremock')

const stubPing = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/prisonApi/api/health/ping',
    },
    response: {
      status: 200,
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

const stubGetAgencyDetails = ({ id, response = {} }) =>
  stubFor({
    request: {
      method: 'GET',
      url: `/prisonApi/api/agencies/${id}`,
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
  stubGetAgencyDetails,
  stubGetPrisonerDetails,
}

const { stubFor } = require('./wiremock')

const stubPing = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/search/health/ping',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { status: 'UP' },
    },
  })

const defaultSearchQuery = {
  equalToJson: {
    prisonerIdentifier: 'A1234AA',
    prisonIds: ['MDI'],
    includeAliases: false,
  },
}

const defaultSearchResponse = [
  {
    alerts: [
      { alertType: 'T', alertCode: 'TCPA' },
      { alertType: 'X', alertCode: 'XCU' },
    ],
    cellLocation: '1-2-015',
    firstName: 'JOHN',
    lastName: 'SMITH',
    prisonerNumber: 'A1234AA',
    prisonName: 'HMP Moorland',
  },
]

const defaultStubbing = { query: defaultSearchQuery, results: defaultSearchResponse }

const stubSearch = ({ query = defaultSearchQuery, results = defaultSearchResponse } = defaultStubbing) =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/search/prisoner-search/match-prisoners',
      bodyPatterns: [query],
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: results,
    },
  })

const stubRestrictedPatientSearch = ({
  query = defaultSearchQuery,
  results = defaultSearchResponse,
} = defaultStubbing) =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/search/restricted-patient-search/match-restricted-patients\\?size=3000',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: results,
    },
  })

module.exports = {
  stubPing,
  stubSearch,
  stubRestrictedPatientSearch,
}

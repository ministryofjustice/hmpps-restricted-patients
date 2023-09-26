/* eslint-disable import/no-extraneous-dependencies */

const { defineConfig } = require('cypress')
const { resetStubs } = require('./integration_tests/mockApis/wiremock')

const auth = require('./integration_tests/mockApis/auth')
const tokenVerification = require('./integration_tests/mockApis/tokenVerification')
const search = require('./integration_tests/mockApis/search')
const prisonApi = require('./integration_tests/mockApis/prisonApi')
const restrictedPatientApi = require('./integration_tests/mockApis/restrictedPatientApi')
const frontendComponents = require('./integration_tests/mockApis/frontendComponents')

module.exports = defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'integration_tests/fixtures',
  screenshotsFolder: 'integration_tests/screenshots',
  videosFolder: 'integration_tests/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  taskTimeout: 60000,
  viewportWidth: 1024,
  viewportHeight: 768,
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        reset: resetStubs,

        getLoginUrl: auth.getLoginUrl,
        stubLogin: ({ caseLoads, roles } = {}) =>
          Promise.all([auth.stubLogin(roles), prisonApi.stubUserCaseloads(caseLoads)]),

        stubAuthUser: auth.stubUser,
        stubUserRoles: auth.stubUserRoles,
        stubAuthPing: status => auth.stubPing(status),

        stubTokenVerificationPing: tokenVerification.stubPing,

        stubSearch: search.stubSearch,
        stubRestrictedPatientSearch: search.stubRestrictedPatientSearch,
        stubSearchPing: status => search.stubPing(status),

        stubGetAgenciesByType: prisonApi.stubGetAgenciesByType,
        stubGetAgencyDetails: prisonApi.stubGetAgencyDetails,
        stubGetPrisonerDetails: prisonApi.stubGetPrisonerDetails,
        stubUserCaseloads: prisonApi.stubUserCaseloads,
        stubPrisonApiPing: status => prisonApi.stubPing(status),

        ...restrictedPatientApi,
        stubRestrictedPatientApiPing: restrictedPatientApi.stubPing,

        ...frontendComponents,
        stubFrontendComponents: () =>
          Promise.all([frontendComponents.stubGetComponents(), frontendComponents.stubGetComponentAssets()]),
      })
    },

    baseUrl: 'http://localhost:3007',
    specPattern: 'integration_tests/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'integration_tests/support/index.js',
  },
})

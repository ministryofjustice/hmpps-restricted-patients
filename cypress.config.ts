/* eslint-disable import/no-extraneous-dependencies */

import { defineConfig } from 'cypress'
import { resetStubs } from './integration_tests/mockApis/wiremock'

import auth from './integration_tests/mockApis/auth'
import tokenVerification from './integration_tests/mockApis/tokenVerification'
import search from './integration_tests/mockApis/search'
import prisonApi from './integration_tests/mockApis/prisonApi'
import restrictedPatientApi from './integration_tests/mockApis/restrictedPatientApi'
import frontendComponents from './integration_tests/mockApis/frontendComponents'

export default defineConfig({
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

        getSignInUrl: auth.getSignInUrl,
        stubSignIn: ({ caseLoads, roles } = {}) =>
          Promise.all([auth.stubSignIn(roles), prisonApi.stubUserCaseloads(caseLoads)]),

        stubAuthUser: auth.stubUser,
        stubUserRoles: auth.stubUserRoles,
        stubAuthPing: status => auth.stubPing(status),

        stubTokenVerificationPing: tokenVerification.stubTokenVerificationPing,

        stubSearch: search.stubSearch,
        stubRestrictedPatientSearch: search.stubRestrictedPatientSearch,
        stubSearchPing: status => search.stubRestrictedPatientPing(status),

        ...prisonApi,
        ...restrictedPatientApi,

        ...frontendComponents,
        stubFrontendComponents: () =>
          Promise.all([frontendComponents.stubGetComponents(), frontendComponents.stubGetComponentAssets()]),
      })
    },

    baseUrl: 'http://localhost:3007',
    specPattern: 'integration_tests/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'integration_tests/support/index.ts',
  },
})

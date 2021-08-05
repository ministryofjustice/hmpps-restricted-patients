const { resetStubs } = require('../mockApis/wiremock')

const auth = require('../mockApis/auth')
const tokenVerification = require('../mockApis/tokenVerification')
const search = require('../mockApis/search')
const prisonApi = require('../mockApis/prisonApi')
const restrictedPatientApi = require('../mockApis/restrictedPatientApi')

module.exports = on => {
  on('task', {
    reset: resetStubs,

    getLoginUrl: auth.getLoginUrl,
    stubLogin: auth.stubLogin,

    stubAuthUser: auth.stubUser,
    stubAuthPing: auth.stubPing,

    stubTokenVerificationPing: tokenVerification.stubPing,

    stubSearch: search.stubSearch,
    stubRestrictedPatientSearch: search.stubRestrictedPatientSearch,
    stubSearchPing: search.stubPing,

    stubGetAgenciesByType: prisonApi.stubGetAgenciesByType,
    stubGetAgencyDetails: prisonApi.stubGetAgencyDetails,
    stubGetPrisonerDetails: prisonApi.stubGetPrisonerDetails,
    stubPrisonApiPing: prisonApi.stubPing,

    stubDischargeToHospital: restrictedPatientApi.stubDischargeToHospital,
  })
}

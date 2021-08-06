const { stubFor } = require('./wiremock')

const stubPing = (status = 200) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/restrictedPatientApi/health/ping',
    },
    response: {
      status,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { status: 'UP' },
    },
  })

const stubDischargeToHospital = ({ status, response = [] }) =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/restrictedPatientApi/discharge-to-hospital',
    },
    response: {
      status,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: response,
    },
  })

module.exports = {
  stubPing,
  stubDischargeToHospital,
}

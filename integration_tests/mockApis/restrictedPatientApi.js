const { stubFor } = require('./wiremock')

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
  stubDischargeToHospital,
}

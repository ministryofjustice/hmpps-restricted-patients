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

const stubGetPatient = ({ prisonerNumber, status = 200, response = [] }) =>
  stubFor({
    request: {
      method: 'GET',
      url: `/restrictedPatientApi/restricted-patient/prison-number/${prisonerNumber}`,
    },
    response: {
      status,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: response,
    },
  })

const stubRemovePatient = ({ prisonerNumber, status = 200, response = {} }) =>
  stubFor({
    request: {
      method: 'DELETE',
      url: `/restrictedPatientApi/restricted-patient/prison-number/${prisonerNumber}`,
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
  stubGetPatient,
  stubRemovePatient,
}

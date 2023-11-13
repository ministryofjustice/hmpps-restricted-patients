import { stubFor } from './wiremock'

const stubRestrictedPatientApiPing = (httpStatus = 200) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/restrictedPatientApi/health/ping',
    },
    response: {
      status: httpStatus,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: { status: httpStatus === 200 ? 'UP' : 'DOWN' },
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

const stubMigrateToHospital = ({ status, response = [] }) =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/restrictedPatientApi/migrate-in-restricted-patient',
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

export default {
  stubRestrictedPatientApiPing,
  stubDischargeToHospital,
  stubGetPatient,
  stubRemovePatient,
  stubMigrateToHospital,
}

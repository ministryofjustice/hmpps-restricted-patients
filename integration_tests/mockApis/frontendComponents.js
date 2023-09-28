const { stubFor } = require('./wiremock')
const getComponentMapping = require('../../wiremock/mappings/frontend-components-mapping.json')
const getAssetsMapping = require('../../wiremock/mappings/frontend-components-assets-mapping.json')

const stubGetComponentsMappingError = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: '/frontend-components/components',
    },
    response: {
      status: 500,
    },
  })

module.exports = {
  stubGetComponents: () => stubFor(getComponentMapping),
  stubGetComponentAssets: () => stubFor(getAssetsMapping),
  stubGetComponentsMappingError,
}

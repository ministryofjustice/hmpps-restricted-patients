const { stubFor } = require('./wiremock')
const getComponentMapping = require('../../wiremock/mappings/frontend-components-mapping.json')
const getAssetsMapping = require('../../wiremock/mappings/frontend-components-assets-mapping.json')

module.exports = {
  stubGetComponents: () => stubFor(getComponentMapping),
  stubGetComponentAssets: () => stubFor(getAssetsMapping),
}

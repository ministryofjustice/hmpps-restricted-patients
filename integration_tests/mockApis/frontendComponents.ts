import { stubFor } from './wiremock'
import getComponentMapping from '../../wiremock/mappings/frontend-components-mapping.json'
import getAssetsMapping from '../../wiremock/mappings/frontend-components-assets-mapping.json'

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

export default {
  stubGetComponents: () => stubFor(getComponentMapping),
  stubGetComponentAssets: () => stubFor(getAssetsMapping),
  stubGetComponentsMappingError,
}

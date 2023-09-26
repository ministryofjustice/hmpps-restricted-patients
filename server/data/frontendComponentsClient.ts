import RestClient from './restClient'
import config from '../config'

export interface Component {
  html: string
  css: string[]
  javascript: string[]
}

export type ComponentType = 'header' | 'footer'

export default class FrontendComponentsClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Frontend Components', config.apis.frontendComponents, token)
  }

  async getComponents<T extends ComponentType[]>(userToken: string): Promise<Record<T[number], Component>> {
    return this.restClient.get<Record<T[number], Component>>({
      path: `/components`,
      query: 'component=header&component=footer',
      headers: { 'x-user-token': userToken },
    })
  }
}

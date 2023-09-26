import FrontendComponentsClient from '../data/frontendComponentsClient'

export interface FrontendComponentsModel {
  headerHtml: string
  footerHtml: string
  cssIncludes: Array<string>
  jsIncludes: Array<string>
}

export default class FrontendComponentsService {
  async getComponents(userToken: string): Promise<FrontendComponentsModel> {
    const { header, footer } = await new FrontendComponentsClient(userToken).getComponents(userToken)

    return {
      headerHtml: header.html,
      footerHtml: footer.html,
      cssIncludes: [...header.css, ...footer.css],
      jsIncludes: [...header.javascript, ...footer.javascript],
    }
  }
}

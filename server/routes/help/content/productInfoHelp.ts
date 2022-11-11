// eslint-disable-next-line import/no-cycle
import { HelpCategory } from '../index'
import type { HelpSection } from '../index'

export default class ProductInfoHelp {
  category = HelpCategory.PRODUCT_INFO

  helpItems(): HelpSection[] {
    return [
      {
        id: 'why-is-the-service-used',
        category: this.category,
        heading: 'Why is the service used?',
        content: `
<p>This service is for managing offenders who are currently held in a secure hospital, but still under the responsibility of the prison.</p> 
<p>It allows users to transfer an offender to a hospital, remove them once they have been transferred back or released from the hospital and also search for an offender to see if they are currently located within a hospital.</p>
<p>It is not a service you would access in the usual manner, but a tool to book offenders out by discharging them to hospital, whilst still allowing the prison to retain ownership, and adding the record to the relevant services users need to access to update the record.</p> 
`.trim(),
      },
      {
        id: 'what-data-is-used',
        category: this.category,
        heading: 'What data is used and influenced via the service?',
        content: `
<p>The data is pulled from NOMIS </p>
`.trim(),
      },
      {
        id: 'how-is-service-supported',
        category: this.category,
        heading: 'How is the service supported?',
        content: `
<p>Currently any issues relating to the service will be managed by the Service Team directly.</p>
`.trim(),
      },
    ]
  }
}

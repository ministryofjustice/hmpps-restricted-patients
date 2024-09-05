// eslint-disable-next-line import/no-cycle
import { HelpCategory } from '../index'
import type { HelpContent, HelpSection } from '../index'

export default class ProductInfoHelp implements HelpContent {
  title = 'Restricted patients product info'

  category = HelpCategory.PRODUCT_INFO

  helpItems: HelpSection[] = [
    {
      id: 'why-is-the-service-used',
      category: this.category,
      heading: 'Why is the service used?',
      content: `
<p>This service is for managing prisoners who are currently held in a secure hospital, but still require sentence management.</p>
<p>It allows users to transfer an prisoner to a hospital, remove them once they have been transferred back or released into the community from the hospital and also search for an prisoner to see if they are currently located within a hospital.</p>
<p>It is not a service you would access in the usual manner, but a tool to book prisoners out by discharging them to hospital, whilst still allowing the prison to retain oversight, and adding the record to the relevant services users need to access to update the record.</p>
`.trim(),
    },
    {
      id: 'what-data-is-used',
      category: this.category,
      heading: 'What data is used and influenced via the service?',
      content: `
<p>The current active status and sentence details of the prisoner/patient are pulled from NOMIS.</p>
<p>When a prisoner is added or removed from the Restricted Patient service this has an effect on the following downstream services:</p>
<ul>
  <li>Manage POM cases - <a href="/help?section=pom-cannot-find-prisoner">eligible restricted patients</a> should be available to assign a POM</li>
  <li>Pathfinder - the new location of the restricted patient should be available</li>
  <li>Delius - the new location of the restricted patient should be available</li>
</ul>
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

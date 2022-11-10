import type { HelpSection } from './index'

export default class IssuesHelp {
  helpItems(): HelpSection[] {
    return [
      {
        id: 'sending-patients-back-to-prison',
        section: 'operational-issues',
        heading: 'An RP is being sent back to prison - how do we bring them in?',
        content:
          'Simply book the offender back in on NOMIS in the usual manner & this will remove them from the RP service accordingly.',
      },
      {
        id: 'booked-out-using-classic-nomis',
        section: 'operational-issues',
        heading: 'Offender was booked out using Classic NOMIS. How do we get them into the service?',
        content: `
<p>The prison will need to raise a ticket for the offender to be migrated into the Restricted Patient service.</p>
<p>Do not advise the prison to self-rectify by booking the offender back in on NOMIS & then out again, as this will trigger several events & also cause erroneous movements on the record.</p>
<p>Instead if the ticket is passed to the New-NOMIS resolver group, it can be done in the back-end without affecting the record.</p> 
        `.trim(),
      },
    ]
  }
}

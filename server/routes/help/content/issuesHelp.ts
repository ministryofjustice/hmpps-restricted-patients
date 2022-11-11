import type { HelpSection } from '../index'
// eslint-disable-next-line import/no-cycle
import { HelpCategory } from '../index'

export default class IssuesHelp {
  category = HelpCategory.ISSUES

  helpItems(): HelpSection[] {
    return [
      {
        id: 'sending-patients-back-to-prison',
        category: this.category,
        heading: 'An RP is being sent back to prison - how do we bring them in?',
        content:
          'Simply book the offender back in on NOMIS in the usual manner and this will remove them from the RP service accordingly.',
      },
      {
        id: 'booked-out-using-classic-nomis',
        category: this.category,
        heading: 'Offender was booked out using Classic NOMIS. How do we get them into the service?',
        content: `
<p>The prison will need to raise a ticket for the offender to be migrated into the Restricted Patient service.</p>
<p>Do not advise the prison to self-rectify by booking the offender back in on NOMIS and then out again, as this will trigger several events and also cause erroneous movements on the record.</p>
<p>Instead if the ticket is passed to the New-NOMIS resolver group, it can be done in the back-end without affecting the record.</p> 
        `.trim(),
      },
      {
        id: 'pom-cannot-find-offender',
        category: this.category,
        heading: 'I am a POM and cannot find my offender who was booked out via the RP service.',
        content: `
<p>POMs can access their RP offenders' records via their caseload in the MPC (POM) service.</p>
<p>Firstly the POM needs to check that the offender has actually been allocated to them in the MPC service, as it seems many offenders have been booked into secure hospitals and a lot of key data has been missed from their records, meaning they have not been allocated in MPC, since they have not appeared, presumed ineligible by the service due to missing data.</p>
<p>Also ensure that the prison caseload the offender was discharged from, matches that of the POM, as since some splits (e.g. Parc) offenders are now assigned to the wrong caseloads.</p>
<p>If there is missing data on the offenders record which means that they are not showing in MPC, the user should correct this.</p> 
<p>Being as the offender is classed as Inactive Out, they would need to be able to search for and update the record.</p>
<p>Therefore you can either advise the user to contact OMU and find someone who has the relevant permissions to do this on their behalf, or App Support can assign the user Global Search and UPDATE_INACTIVE_INST on NOMIS for the purpose of locating and updating the record and then once the user confirms this has been done and the record is now visible to the POM, then remove the roles again before closing the ticket/request.</p>
<p>The data required for an offender to be visible for allocation in MPC is:</p>
<ul>
  <li>Convicted (prisoners on remand do not need a POM)</li>  
  <li>Over 18 years old (prisoners under 18 do not need a POM)</li>  
  <li>Not a civil case</li>  
  <li>There is an active sentence with a start date - Sentenced prisoners must have the earliest release date or parole review date (CRD, ARD, TED, PED) in NOMIS</li>  
  <li>If a lifer case sometimes the case record needs to be ‘re-set’ by unticking and re-ticking the lifer box</li>  
  <li>Sentence calculation has been completed</li>  
</ul>
        `.trim(),
      },
      {
        id: 'reviewing-category',
        category: this.category,
        heading: 'How do I review the category of a Restricted Patient?',
        content: `
<p>See the below policy document which states offenders in a Secure Hospital do not need a cat-review. Reviews are only required if the offender is admitted back into a prison, with a 10 day deadline.</p>
<a href="https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/1011502/security-categorisation-pf.pdf">Security Categorisation Police Framework (pdf)</a> 
        `.trim(),
      },
    ]
  }
}

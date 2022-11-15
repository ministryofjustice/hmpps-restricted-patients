import type { HelpSection } from '../index'
// eslint-disable-next-line import/no-cycle
import { HelpContent, HelpCategory } from '../index'

export default class IssuesHelp implements HelpContent {
  title = 'Operational issues'

  category = HelpCategory.ISSUES

  helpItems: HelpSection[] = [
    {
      id: 'sending-patients-back-to-prison',
      category: this.category,
      heading: 'A restricted patient is being sent back to prison - how do we bring them in?',
      content:
        'Simply book the offender back into NOMIS in the usual manner and this will remove them from the Restricted Patient service automatically.',
    },
    {
      id: 'booked-out-using-classic-nomis',
      category: this.category,
      heading: 'Offender was booked out using Classic NOMIS. How do we get them into the service?',
      content: `
<p>This request needs to be raised via the Helpdesk, who can be contacted by calling 0800 917 5148, or #6598 from inside a prison. Ask the agent who takes your call to read the Knowledge Article KB0020285, which clearly outlines the process they need to follow to correctly route your ticket.</p>
<p>The prison should not self-rectify by booking the offender back in on NOMIS and then out again, as this will trigger several events and also cause erroneous movements on the record.</p>
<p>Instead if the ticket is passed to the New-NOMIS resolver group, it can be done in the back-end without affecting the NOMIS record.</p> 
        `.trim(),
    },
    {
      id: 'not-released-to-hospital',
      category: this.category,
      heading: `How can I add a prisoner to Restricted Patients if they were not released to a hospital via classic NOMIS?`,
      content: `
<p>If the prisoner wasn't released to hospital then they cannot be added to Restricted Patients. In this situation contact the Support team for advice.</p>
        `.trim(),
    },
    {
      id: 'pom-cannot-find-offender',
      category: this.category,
      heading: 'I am a POM and cannot find my offender who was booked out via the Restricted Patient service.',
      content: `
<p>POMs can access their restricted patient offenders' records via their caseload in the MPC (POM) service.</p>
<p>The POM needs to check that the offender has actually been allocated to them in the MPC service.  Many offenders have been booked into secure hospitals but key data was missing from their records.  This meant that they were not allocated in MPC as they were presumed ineligible due to missing data.</p>
<p>Also ensure that the prison caseload the offender was discharged from matches that of the POM.  Following some splits (e.g. Parc), offenders were assigned to the wrong caseloads.</p>
<p>If there is missing data on the offender's record which means that they are not showing in MPC, the POM should correct this. See the help on <a href="/help?section=updating-restricted-patient-in-nomis">updating restricted patients in NOMIS</a>.</p> 
<p>For an offender to be visible for allocation in MPC they must be:</p>
<ul>
  <li>Convicted (prisoners on remand do not need a POM)</li>  
  <li>Over 18 years old (prisoners under 18 do not need a POM)</li>  
  <li>Not a civil case</li>  
  <li>Have an active sentence with a start date - sentenced prisoners must have the earliest release date or parole review date (CRD, ARD, TED, PED) in NOMIS</li>  
  <li>If a lifer case, sometimes the case record needs to be 'reset' by un-ticking and re-ticking the lifer box</li>  
  <li>Have their sentence calculation completed</li>  
</ul>
        `.trim(),
    },
    {
      id: 'updating-restricted-patient-in-nomis',
      category: this.category,
      heading: 'How do I update a restricted patient in NOMIS?',
      content: `
<p>Being as the offender is classed as Inactive Out, you cannot search for and update the offender record in NOMIS.</p>
<p>Therefore you can either contact OMU and find someone who has the relevant permissions to do this on your behalf, or App Support can assign users Global Search and UPDATE_INACTIVE_INST on NOMIS for the purpose of locating and updating the offender record. Once the offender has been updated the roles will be removed again before closing the ticket/request.</p>
        `.trim(),
    },
    {
      id: 'reviewing-category',
      category: this.category,
      heading: 'How do I review the category of a restricted patient?',
      content: `
<p>See the below policy document which states offenders in a Secure Hospital do not need a cat-review. Reviews are only required if the offender is admitted back into a prison, with a 10 day deadline.</p>
<a href="https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/1011502/security-categorisation-pf.pdf">Security Categorisation Police Framework (pdf)</a> 
        `.trim(),
    },
  ]
}

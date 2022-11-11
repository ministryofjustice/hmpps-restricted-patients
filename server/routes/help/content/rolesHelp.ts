// eslint-disable-next-line import/no-cycle
import { HelpCategory } from '../index'
import type { HelpSection } from '../index'

export default class RolesHelp {
  category = HelpCategory.ROLES

  helpItems(): HelpSection[] {
    return [
      {
        id: 'restricted-patient-removal',
        category: this.category,
        heading: 'Restricted Patient Removal',
        content: `
<p>Allows a user to remove someone as a restricted patient if they have been released from a hospital to the community, or have died.</p>
<p>Intended users are OMU hub managers and MHCS staff.</p>
<p>This role is visible to LSAs.</p> 
`.trim(),
      },
      {
        id: 'restricted-patient-search',
        category: this.category,
        heading: 'Restricted Patient Search',
        content: `
<p>Role is primarily for users within Mental Health Casework Section and allows them to search the restricted patients database to find the current secure hospital location of an offender.</p> 
<p>Intended users are MHCS staff and Head of OMU.</p>
<p>It is not visible to LSAs and should not be given to regular users.</p> 
`.trim(),
      },
      {
        id: 'restricted-patient-transfer',
        category: this.category,
        heading: 'Restricted Patient Transfer',
        content: `
<p>Allows the release of a prisoner from Prison, to a secure hospital, where they are being detained under the mental health act.</p>
<p>Intended users are Reception staff and OMU hub managers.</p>
<p>This role is visible to LSAs.</p> 
`.trim(),
      },
    ]
  }
}

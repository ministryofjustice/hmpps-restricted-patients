// eslint-disable-next-line import/no-cycle
import { HelpCategory } from '../index'
import type { HelpContent, HelpSection } from '../index'

export default class AccountsHelp implements HelpContent {
  title = 'Accounts, access and sign in'

  category = HelpCategory.ACCOUNTS

  helpItems: HelpSection[] = [
    {
      id: 'can-i-get-access',
      category: this.category,
      heading: 'Can I get access to the Restricted Patients service?',
      content: `
<p>LSAs can add 2 roles to a users DPS account to allow them access to the service.</p>
<p>Access for MHCS staff is currently being managed by the Restricted Patients service team.</p>
`.trim(),
    },
    {
      id: 'can-i-get-someone-else-access',
      category: this.category,
      heading: 'Can I get someone else access to the service?',
      content: `
<p>LSAs can add 2 roles to a users DPS account to allow them access to the service.</p>
<p>Access for MHCS staff is currently being managed by the Restricted Patients service team.</p>
`.trim(),
    },
    {
      id: 'new-password',
      category: this.category,
      heading: 'I need a new password',
      content: `
<p>Users can reset their own password using the reset option on the sign in page. Note for users who have a NOMIS account, this will also change the password on NOMIS.</p>
`.trim(),
    },
    {
      id: 'account-locked',
      category: this.category,
      heading: 'My account is locked',
      content: `
<p>Users can contact their LSA for an account reactivation.</p>
`.trim(),
    },
    {
      id: 'reset-password-no-email',
      category: this.category,
      heading: `I try to reset my password but it's not recognising my email`,
      content: `
<p>Please enter your username instead. If this still does not allow access contact your LSA to check your email address is correct on your NOMIS account.</p>
`.trim(),
    },
  ]
}

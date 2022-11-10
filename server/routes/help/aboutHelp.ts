import type { HelpSection } from './index'

export default class AboutHelp {
  helpItems(): HelpSection[] {
    return [
      {
        id: 'restricted-patient-definition',
        section: 'about-restricted-patients',
        heading: 'A Restricted Patient is:',
        content: `
Someone in hospital who has special restrictions applied under the Mental Health Act. These restrictions are:
<ul>
  <li><b>37/41</b> – 37 is the hospital order and 41 the restriction.</li>
  <li><b>47/49</b> – means they have been transferred from prison and 49 is the restriction.</li>
  <li><b>48/49</b> – means they are remanded and transferred to hospital as they require urgent treatment before sentencing. Again 49 is the restriction.</li> 
    <ul><li><strong>We do NOT prevent remand prisoners from being moved into the Restricted patient service, because on sentencing these are considered 47/49s. Once the sentence details are added, these restricted patients will then appear in the DPS Manage POM cases service as requiring a POM to be allocated.</strong></li></ul>
  <li><b>45a</b> – transferred straight from court to hospital with a restriction applied. In this case the Court should send the Hospital Order and Order of Imprisonment to the local prison who will create or update the NOMIS record and add the patient to the service.</li>
</ul>
`.trim(),
      },
      {
        id: 'omic-restricted-patients',
        section: 'about-restricted-patients',
        heading: 'OMIC are only concerned with restricted patients with the following restrictions:',
        content: `
<ul>
  <li><b>47/49</b></li>
  <li><b>45a</b></li>
</ul>
`.trim(),
      },
    ]
  }
}

const alertFlagLabels = [
  { alertCodes: ['HA'], classes: 'alert-status alert-status--acct', label: 'ACCT open' },
  {
    alertCodes: ['HA1'],
    classes: 'alert-status alert-status--acct-post-closure',
    label: 'ACCT post closure',
  },
  {
    alertCodes: ['XSA'],
    classes: 'alert-status alert-status--assault',
    label: 'Staff assaulter',
  },
  {
    alertCodes: ['XA'],
    classes: 'alert-status alert-status--arsonist',
    label: 'Arsonist',
    img: '/assets/images/alert-icons/Arsonist_icon.png',
  },
  {
    alertCodes: ['PEEP'],
    classes: 'alert-status alert-status--disability',
    label: 'PEEP',
    img: '/assets/images/alert-icons/Disability_icon.png',
  },
  { alertCodes: ['XEL'], classes: 'alert-status alert-status--elist', label: 'E-list' },
  {
    alertCodes: ['XRF'],
    classes: 'alert-status alert-status--risk-females',
    label: 'Risk to females',
  },
  { alertCodes: ['XTACT'], classes: 'alert-status alert-status--tact', label: 'TACT' },
  {
    alertCodes: ['XCO'],
    classes: 'alert-status alert-status--corruptor',
    label: 'Corruptor',
    img: '/assets/images/alert-icons/CU_icon.png',
  },
  {
    alertCodes: ['XCA'],
    classes: 'alert-status alert-status--chemical-attacker',
    label: 'Chemical attacker',
  },
  {
    alertCodes: ['XCI'],
    classes: 'alert-status alert-status--concerted-indiscipline',
    label: 'Concerted indiscipline',
  },
  { alertCodes: ['XR'], classes: 'alert-status alert-status--racist', label: 'Racist' },
  {
    alertCodes: ['RTP', 'RLG'],
    classes: 'alert-status alert-status--risk-lgbt',
    label: 'Risk to LGBT',
  },
  {
    alertCodes: ['XHT'],
    classes: 'alert-status alert-status--hostage-taker',
    label: 'Hostage taker',
  },
  {
    alertCodes: ['XCU'],
    classes: 'alert-status alert-status--controlled-unlock',
    label: 'Controlled unlock',
  },
  {
    alertCodes: ['XGANG'],
    classes: 'alert-status alert-status--gang-member',
    label: 'Gang member',
  },
  { alertCodes: ['CSIP'], classes: 'alert-status alert-status--csip', label: 'CSIP' },
  { alertCodes: ['F1'], classes: 'alert-status alert-status--veteran', label: 'Veteran' },
  {
    alertCodes: ['LCE'],
    classes: 'alert-status alert-status--care-experienced',
    label: 'Care experienced',
  },
  {
    alertCodes: ['RNO121'],
    classes: 'alert-status alert-status--no-one-to-one',
    label: 'No one-to-one',
  },
  { alertCodes: ['RCON'], classes: 'alert-status alert-status--conflict', label: 'Conflict' },
  {
    alertCodes: ['RCDR'],
    classes: 'alert-status alert-status--quarantined',
    label: 'Quarantined',
  },
  {
    alertCodes: ['URCU'],
    classes: 'alert-status alert-status--reverse-cohorting-unit',
    label: 'Reverse Cohorting Unit',
  },
  {
    alertCodes: ['UPIU'],
    classes: 'alert-status alert-status--protective-isolation-unit',
    label: 'Protective Isolation Unit',
  },
  { alertCodes: ['USU'], classes: 'alert-status alert-status--shielding-unit', label: 'Shielding Unit' },
  { alertCodes: ['URS'], classes: 'alert-status alert-status--refusing-to-shield', label: 'Refusing to shield' },
  { alertCodes: ['RKS'], classes: 'alert-status alert-status--risk-to-known-adults', label: 'Risk to known adults' },
  { alertCodes: ['VIP'], classes: 'alert-status alert-status--isolated-prisoner', label: 'Isolated' },
].sort((a, b) => a.label.localeCompare(b.label))

const profileAlertCodes = [
  'HA',
  'HA1',
  'XSA',
  'XA',
  'PEEP',
  'XEL',
  'XRF',
  'XTACT',
  'XCO',
  'XCA',
  'XCI',
  'XR',
  'RTP',
  'RLG',
  'XHT',
  'XCU',
  'XGANG',
  'CSIP',
  'F1',
  'LCE',
  'RNO121',
  'RCON',
  'RCDR',
  'URCU',
  'UPIU',
  'USU',
  'URS',
]

export type AlertType = {
  alertType: string
  alertCode: string
  active: boolean
  expired: boolean
}

export type FormattedAlertType = {
  alertCodes: string[]
  classes: string
  label: string
}

export function getFormattedAlerts(allPrisonAlerts: AlertType[]): FormattedAlertType[] {
  const activePrisonerAlerts = allPrisonAlerts?.filter((alert: AlertType) => !alert.expired)
  const prisonerAlerts = activePrisonerAlerts?.map((alert: AlertType) => alert.alertCode)
  const alertCodesToShow = profileAlertCodes.filter(alertFlag => prisonerAlerts?.includes(alertFlag))

  return alertFlagLabels.filter(alertFlag => alertFlag.alertCodes.some(alert => alertCodesToShow?.includes(alert)))
}

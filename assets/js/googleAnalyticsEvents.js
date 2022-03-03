$(function () {
  const $pathname = window.location.pathname

  function sendEvent(action, category, label) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
    })
  }

  if ($pathname.includes('prisoner-moved-to-hospital')) {
    const hospital = window.location.pathname.split('/')[3]
    sendEvent('Prisoner moved to hospital', 'Restricted patients movement', 'Prisoner moved to ' + hospital)
  }
  if ($pathname.includes('person-removed')) {
    sendEvent('Prisoner removed from hospital', 'Restricted patients removal', 'Prisoner removed from hospital')
  }
})

accessibleAutocomplete.enhanceSelectElement({
  defaultValue: '',
  selectElement: document.querySelector('#hospital'),
})

$(function () {
  $('.js-hospital-submit').on('click', function () {
    if (!$.trim($('.autocomplete__input').val()).length) {
      $('.js-hospital-select').val('')
    }
  })
})

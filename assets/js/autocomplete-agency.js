accessibleAutocomplete.enhanceSelectElement({
  defaultValue: '',
  selectElement: document.querySelector('#agency'),
})

$(function () {
  $('.js-agency-submit').on('click', function () {
    if (!$.trim($('.autocomplete__input').val()).length) {
      $('.js-agency-select').val('')
    }
  })
})
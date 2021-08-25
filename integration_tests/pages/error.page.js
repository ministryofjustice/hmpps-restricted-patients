const page = require('./page')

module.exports = {
  verifyOnPage: errorMessage =>
    page(`${errorMessage}`, {
      form: () => ({
        continue: () => cy.get('[data-test="continue-after-error"]'),
      }),
    }),
}

module.exports = (name, pageObject = {}) => {
  const checkOnPage = () => cy.get('h1').contains(name)
  const signOut = () => cy.get('[data-qa=sign-out]')
  checkOnPage()
  return { ...pageObject, checkStillOnPage: checkOnPage, signOut }
}

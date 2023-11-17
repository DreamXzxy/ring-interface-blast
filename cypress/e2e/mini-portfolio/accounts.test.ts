import { getTestSelector } from '../../utils'

describe('Mini Portfolio account drawer', () => {
  beforeEach(() => {
    cy.visit('/swap')
  })

  it('fetches ENS name', () => {
    cy.hardhat().then(() => {
      const haydenAccount = '0x50EC05ADe8280758E2077fcBC08D878D4aef79C3'
      const haydenENS = 'hayden.eth'

      // Opens the account drawer
      cy.get(getTestSelector('web3-status-connected')).click()

      // Simulate wallet changing to Hayden's account
      cy.window().then((win) => win.ethereum.emit('accountsChanged', [haydenAccount]))

      // Hayden's ENS name should be shown
      cy.contains(haydenENS).should('exist')

      // Close account drawer
      cy.get(getTestSelector('close-account-drawer')).click()

      // Switch chain to Polygon
      cy.get(getTestSelector('chain-selector')).eq(1).click()
      cy.contains('Polygon').click()

      //Reopen account drawer
      cy.get(getTestSelector('web3-status-connected')).click()

      // Simulate wallet changing to Hayden's account
      cy.window().then((win) => win.ethereum.emit('accountsChanged', [haydenAccount]))

      // Hayden's ENS name should be shown
      cy.contains(haydenENS).should('exist')
    })
  })
})

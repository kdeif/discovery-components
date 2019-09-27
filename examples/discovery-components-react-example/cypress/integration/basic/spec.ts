describe('basic test', () => {
  beforeEach(() => {
    cy.server();
    cy.fixture('basic/query.json').as('queryJSON');
    cy.route('POST', '**/query?version=2019-01-01', '@queryJSON').as('postQuery');
    cy.visit('/');
  });
  describe('When entering a query', () => {
    beforeEach(() => {
      cy.get('.bx--search-input').type('abil{enter}');
    });

    it('makes the appropriate query request', () => {
      cy.wait('@postQuery')
        .its('requestBody.aggregation')
        .should('eq', '[term(author,count:10),term(subject,count:5)]');

      cy.wait('@postQuery')
        .its('requestBody.natural_language_query')
        .should('eq', 'abil');
    });
  });
});

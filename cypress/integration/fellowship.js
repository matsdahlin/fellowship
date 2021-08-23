/// <refernce types="cypress" />

beforeEach(() => {
  cy.intercept({ method: 'GET', url: '/consultants' }, { fixture: 'consultants-response.json' }).as(
    'ninjaList'
  );
  cy.visit('http://localhost:5000');
  cy.wait('@ninjaList');
});

it('Loads', () => {
  cy.intercept({ url: '/consultants', method: 'GET' }, { fixture: 'consultants-response.json' }).as(
    'ninjaList'
  );
  cy.visit('http://localhost:5000');
  cy.contains('fellowship');
  cy.get('[data-cy="cards-container"]').should('not.be.empty');
});

it('shows friendly error message if API call fails', () => {
  cy.intercept({ url: '/consultants', method: 'GET' }, { statusCode: 500 }).as('ninjaList');
  cy.visit('http://localhost:5000');
  cy.wait('@ninjaList');
  cy.get('[data-cy="error-message"]');
});

it('shows friendly error message if API call returns 404', () => {
  cy.intercept({ url: '/consultants', method: 'GET' }, { statusCode: 404 }).as('ninjaList');
  cy.visit('http://localhost:5000');
  cy.wait('@ninjaList');
  cy.get('[data-cy="error-message"]');
});

it('only shows ninjas with names that contain filter string', () => {
  cy.get('[data-cy=cards-container]')
    .children()
    .then(($children) => {
      const initialNinjaCount = $children.length;
      expect(initialNinjaCount).to.be.greaterThan(0);

      cy.get('[data-cy=filter-input]').type('Ahm');
      cy.get('[data-cy=cards-container]').children().should('have.length.below', initialNinjaCount);
      cy.get('[data-cy=ninja-name]').contains('Ahm', { matchCase: false });
    });
});

it('shows friendly error message if there are no results', () => {
  cy.get('[data-cy=cards-container]').children().should('have.length.above', 0);
  cy.get('[data-cy=filter-input]').type('gjlaejfaef');
  cy.get('[data-cy=cards-container]').children().should('have.length', 1);
});

beforeEach(() => {
  cy.visit('/');
});

describe('movies e2e testing', () => {
  it('should contain input field', () => {
    cy.get('#searchText').should('exist');
  });
  it('should contain submit button', () => {
    cy.get('#search').should('exist');
  });

  it('should be able to type in search field ', () => {
    cy.get('#searchText').should('exist').type('something');
    cy.get('#searchText').should('have.value', 'something');
  });

  it('should get mock data with correct url', () => {
    cy.intercept('GET', 'http://omdbapi.com/?apikey=416ed51a&s=*', {
      fixture: 'omdbResponse',
    }).as('omdbCall');
    cy.get('#searchText').type('Saw');

    cy.get('#search').click();

    cy.wait('@omdbCall').its('request.url').should('contain', 'Saw');
  });

  it('should render api data to html', () => {
    cy.get('#searchText').type('Saw');

    cy.get('#search').click();

    cy.get('#movie-container').should('exist');
    cy.get('h3').should('exist');
    cy.get('img').should('exist');
  });
  it('should display error message', () => {
    cy.get('#searchText').type(' ');

    cy.get('#search').click();

    cy.get('#movie-container').should('exist');
    cy.get('p').should('exist').should('contain', 'Inga');
  });
});

beforeEach(() => {
  cy.visit('/');
});

describe('dom elements tests', () => {
  it('should contain input field', () => {
    cy.get('#searchText').should('exist');
  });

  it('should contain submit button', () => {
    cy.get('#search').should('exist').should('contain', 'Sök');
  });

  it('should be able to type in searchText ', () => {
    cy.get('#searchText').should('exist').type('something');
    cy.get('#searchText').should('have.value', 'something');
  });

  it('should display error message', () => {
    cy.get('#searchText').type(' ');

    cy.get('#search').click();

    cy.get('#movie-container').should('exist');
    cy.get('p').should('exist').should('contain', 'Inga');
  });
});

describe('mock data tests', () => {
  it('should get mock data with correct url', () => {
    cy.intercept('GET', 'http://omdbapi.com/?apikey=416ed51a&s=*', {
      fixture: 'omdbResponse',
    }).as('omdbCall');
    cy.get('#searchText').type('Saw');

    cy.get('#search').click();

    cy.wait('@omdbCall').its('request.url').should('contain', 'Saw');
    cy.get('#movie-container').should('contain', 'Saw');
    cy.get('.movie').should('have.length', 1);
  });

  it('should not get mock data with incorrect url', () => {
    cy.intercept('GET', 'http://omdbapi.com/?apikey=416ed51a&s=*', {
      fixture: 'noResponse',
    }).as('omdbCall');
    cy.get('#searchText').type(' ');

    cy.get('#search').click();

    cy.wait('@omdbCall');
    cy.get('#movie-container').should('not.contain', 'Saw');
    cy.get('movie').should('have.length', 0);
    cy.get('p').should('exist').should('contain', 'Inga');
  });

  it('should render mock data to html', () => {
    cy.intercept('GET', 'http://omdbapi.com/?apikey=416ed51a&s=*', {
      fixture: 'omdbResponse',
    }).as('omdbCall');
    cy.get('#searchText').type('Saw');

    cy.get('#search').click();

    cy.wait('@omdbCall');

    cy.get('#movie-container').should('exist');
    cy.get('.movie').should('exist').should('have.length', 1);
    cy.get('h3').should('exist');
    cy.get('img').should('exist');
    cy.get(':nth-child(1) > h3').should('contain', 'Saw');
  });
});

describe('api data tests', () => {
  it('should get api data with correct url', () => {
    cy.get('#searchText').type('Saw');

    cy.get('#search').click();

    cy.get('#movie-container').should('contain', 'Saw');
  });

  // it('should not get api data with incorrect url', () => {
  //   cy.get('#searchText').type(' ');

  //   cy.get('#search').click();

  //   cy.get('#movie-container').should('not.contain', 'Saw');
  //   cy.get('p').should('exist').should('contain', 'Inga');
  // });

  // it('should render api data to html', () => {
  //   cy.get('#searchText').type('Saw');

  //   cy.get('#search').click();

  //   cy.get('#movie-container').should('exist');
  //   cy.get('.movie').should('exist');
  //   cy.get('h3').should('exist');
  //   cy.get('img').should('exist');
  //   cy.get(':nth-child(1) > h3').should('contain', 'Saw');
  //   cy.get(':nth-child(2) > h3').should('contain', 'Saw II');
  // });
});

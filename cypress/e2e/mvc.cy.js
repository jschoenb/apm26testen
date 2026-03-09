describe("My first test",function () {
  beforeEach(function(){
    cy.visit("http://apm.schoenboeck.kwmhgb.at/index.html");
  });

  it("Test number of contacts",function(){
    cy.get('li.whatsapp-element').its('length').should('be.eq',7);
  });

  it("Test click to open chats", function(){
    cy.get('#contact_1').click();
    cy.get('#header').contains("Susi Musterfrau");
  });

  it("Insert own message", function(){
    cy.get('#contact_1').click();
    cy.get('#input').type("Nachricht von Cypress{enter}");
    cy.get('.message').last().should('have.class', 'out');
    cy.get('.message').last().contains("Cypress");
  });
})
describe("Battleships E2E", () => {
  it("loads the splash screen and starts a game", () => {
    cy.visit("/");
    cy.contains(/battleships/i).should("be.visible");
    cy.contains(/Welcome to your first mission as Chief Commander of the battleship HMS Magnolia!/i).should(
      "be.visible"
    );
    cy.contains(/Outsmart your opponents and devise the perfect strategy to sink their fleet./i).should("be.visible");
    cy.contains(/start/i).click();
  });

  it("allows the user to enter a target and shoot", () => {
    cy.visit("/");
    cy.contains(/start/i).click();
    cy.get('input[placeholder*="Type target coordinates like E7"]', { timeout: 10000 }).type("E7");
    cy.contains(/shoot!/i, { timeout: 10000 }).click();
    // Check that the square-E7 element has either square-HIT or square-MISS class
    cy.get(".square-E7", { timeout: 10000 }).should(($el) => {
      expect(
        $el.hasClass("square-HIT") || $el.hasClass("square-MISS"),
        "square-E7 should have class square-HIT or square-MISS"
      ).to.be.true;
    });
  });

  it("prevents shooting with invalid coordinates", () => {
    cy.visit("/");
    cy.contains(/start/i).click();
    cy.get('input[placeholder*="Type target coordinates like E7"]', { timeout: 10000 }).type("ZZ");
    cy.contains(/shoot!/i, { timeout: 10000 }).click();
    // Optionally, check for error message or no board update
  });

  it("is responsive on mobile", () => {
    cy.viewport("iphone-6");
    cy.visit("/");
    cy.contains(/battleships/i).should("be.visible");
  });
});

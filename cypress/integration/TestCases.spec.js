var html = [];

describe("Google visit", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('https://www.google.com/')
    cy.request('https://www.google.com/').then((response) => {
      expect(response.status).to.eq(200)
    })
  })

  it("Response of the website should be success i.e 200", () => {
    cy.request("https://www.google.com/").then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("Search should be successful", () => {
    cy.fixture("testdata").then(function (testdata) {
      this.testdata = testdata;
      cy.get('input[name="q"]').eq(0).type(this.testdata.movieName);
      cy.get('input[name="btnK"]').eq(0).click();
      cy.wait(5000);
      cy.contains("span", this.testdata.IMDb).should("be.visible");
      cy.contains("span", this.testdata.rating).should("be.visible");
    });
  });

  it("Cast and crew of the show should be rightly mentioned", () => {
    cy.fixture("testdata").then(function (testdata) {
      this.testdata = testdata;
      cy.get('input[name="q"]').eq(0).type(this.testdata.movieName);
      cy.get('input[name="btnK"]').eq(0).click();
      cy.wait(5000);
      cy.get(".gsrt.IZACzd")
        .contains(this.testdata.rating)
        .click({ force: true });
      cy.contains(this.testdata.movieName);
      cy.waitFor(2000);
      cy.contains(this.testdata.ratingOnIMDB);
      cy.contains(this.testdata.GenreComedy);
      cy.contains(this.testdata.GenreDrama);
      cy.contains("a", this.testdata.CastAndCrew).click({ force: true });
      cy.contains("h1", "Full Cast & Crew").should("be.visible");
      cy.wait(2000);
      cy.get("table")
        .contains("td", this.testdata.Director)
        .should("be.visible");
      cy.get(".cast_list")
        .contains("td", this.testdata.Director)
        .should("be.visible");
      cy.get(".character").children().contains("Tony");
      cy.get(".character").children().contains(this.testdata.Episodes);
    });
  });

  it("Cast data should be downloaded successfully", () => {
        cy.fixture('testdata').then(function (testdata) {
            this.testdata = testdata;
        cy.get('input[name="q"]').eq(0).type(this.testdata.movieName);
        cy.get('input[name="btnK"]').eq(0).click();
        cy.wait(5000)
        cy.get('.gsrt.IZACzd').contains(this.testdata.rating).click({force:true});
        cy.contains('a',this.testdata.CastAndCrew).click({force:true});
        cy.get("table.cast_list")
        .eq(0)
        .invoke("prop", "innerHTML")
        .then((html) => {

            const parser = new DOMParser();

            const doc = parser.parseFromString("<table>" + html, "text/html");

            const trs = doc.querySelectorAll("tr");

            const data = Array.from(trs)
            .filter((tr) => tr.textContent.trim())
            .map((tr) =>
                tr.textContent
                .replace(/,\s+(\d{4})/g, "\n$1")
                .split("\n")
                .filter((r) => r.trim() && !r.trim().includes("..."))
                .map((r) => r.replace(/\s+/g, " ").trim())
                .join(',')
            );
            cy.log(data.length) //96 which is true

            data.unshift([
            "Name, Cast Name, Episodes Appeared In, Time of Appearance",
            ]);

        cy.writeFile("cypress/fixtures/CastAndCrew.csv", data.join('\n'));
    

      });

   
  });
});
});

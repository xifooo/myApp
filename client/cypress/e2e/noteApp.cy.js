describe("Note app", function () {
  it.only("login fails with wrong password", function () {
    cy.contains("Login").click()
    cy.get("#user-name").type("mluukkai")
    cy.get("#pass-word").type("wrong")
    cy.get("#login-button").click()

    // cy.get(".error").contains("wrong credentials")
    cy.get(".error").should("contain", "Wrong credentials")
  })

  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset")
    const user = {
      name: "Matti Luukkainen",
      username: "mluukkai",
      password: "salainen"
    }
    cy.request("POST", "http://localhost:3001/api/users/", user)
    cy.visit("http://localhost:3000")
  })

  // it("user can login", function () {
  // })

  it("login form can be opened", function () {
    cy.contains("Login").click()
    cy.get("#user-name").type("mluukkai")
    cy.get("#pass-word").type("salainen")
    cy.get("#login-button").click()
    // cy.contains("mlonokai")
  })


  describe("when logged in", function () {
    beforeEach(function () {
      const user = {
        username: "mluukkai",
        password: "salainen"
      }
      cy.request("POST", "http://localhost:3001/api/login", user)
        .then(res => {
          localStorage.setItem("loggedNoteappUser", JSON.stringify(res.body))
          cy.visit("http://localhost:3000")
        })
    })

    it("a new note can be created", function () {
      cy.contains("add a new note").click()
      cy.get("input").type("a note created by cypress")
      cy.contains("save").click()
      cy.contains("a note created by cypress")
    })


    describe("and several notes exist", function () {
      beforeEach(function () {
        cy.createNote({ content: "first note", important: false })
        cy.createNote({ content: "second note", important: false })
        cy.createNote({ content: "third note", important: false })
      })

      it("one of those can be made important", function () {
        cy.contains("second note").parent().find("button").as("theButton")
        cy.get("@theButton").click()
        cy.get("@theButton").should("contain", "make not important")
      })
    })

    describe("and a note exists", function () {
      beforeEach(function () {
        cy.contains("new note").click()
        cy.get("input").type("another note cypress")
        cy.contains("save").click()
      })

      it("it can be made important", function () {
        cy.contains("another note cypress")
          .contains("make important")
          .click()

        cy.contains("another note cypress")
          .contains("make not important")
      })
    })
  })

})
import { NavigationPage } from "../../support/pageObjects/navigationPage"
import { homepage } from "../../support/pageObjects/Homepage"

let User
describe("01_Verify_Valid_Login", function () {


    beforeEach(function () {
        cy.fixture("Login_Data/01_Valid_login.json").then((data) => {
            this.data = data
            User = this.data.User

        })
        cy.clearCookies()
        cy.clearLocalStorage()
        //navigate to the url
        NavigationPage.navigateToUrl()

    })

    it("01_Verify_Valid_Login", function () {
        //login with valid user
        NavigationPage.loginWithCredentials(User)
        //verify the home is visble 
        homepage.verifyHomepage()
    })
    afterEach(() => {
        homepage.logout()
    })
})
